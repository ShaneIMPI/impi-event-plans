import { Packer } from "docx";
import { saveAs } from "file-saver";
import { loadImageBuffer } from "./shared.js";
import { buildSafetyManagementPlan } from "./safetyPlan.js";
import { buildSecurityManagementPlan } from "./securityPlan.js";
import { buildParkingManagementPlan } from "./parkingPlan.js";
import { buildEventRiskAssessment } from "./riskAssessmentPlan.js";
import { buildTrafficManagementPlan } from "./trafficPlan.js";
import { buildEmergencyEvacuationPlan } from "./evacuationPlan.js";
import { buildSafetyOfficerAppointmentLetter } from "./appointmentLetter.js";
import { IMPI } from "../data/companyInfo.js";
import { lookupSignatureAsset, lookupDesignation } from "../data/signatureLibrary.js";
import { generateSignatureDataUrl } from "./signatureGen.js";

function slugify(text) {
  return (text || "event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Resolves a public-asset path against the deployed site's base URL, so it
// works whether served at the domain root (local dev) or under a subpath
// like /impi-event-plans/ (GitHub Pages project sites).
export function assetPath(path) {
  return `${import.meta.env?.BASE_URL || "/"}${path.replace(/^\//, "")}`;
}

// Resolves a person's name to { signatureBuffer, designation }: a real
// signature (and stored title) from the library if we have one on file,
// otherwise a generated signature approximation and no designation. Returns
// nulls if no name was given.
async function resolveSigner(name) {
  if (!name || !name.trim()) return { signatureBuffer: null, designation: "" };
  const assetFile = lookupSignatureAsset(name);
  if (assetFile) {
    return {
      signatureBuffer: await loadImageBuffer(assetPath(`assets/signatures/${assetFile}`)),
      designation: lookupDesignation(name),
    };
  }
  try {
    const dataUrl = await generateSignatureDataUrl(name.trim());
    return { signatureBuffer: await loadImageBuffer(dataUrl), designation: "" };
  } catch (err) {
    console.warn("Signature generation failed for", name, err);
    return { signatureBuffer: null, designation: "" };
  }
}

export async function generateSelectedDocuments(event, toggledModules) {
  const masterLogo = await loadImageBuffer(IMPI.masterLogoPath);
  // eventLogo is stored as a base64 data URL string (see FieldInput.jsx) so it
  // survives IndexedDB round-trips safely; loadImageBuffer handles that format
  // directly. Still accept a raw Blob too, for any old in-memory state.
  const eventLogo =
    event.eventLogo && (typeof event.eventLogo === "string" || event.eventLogo instanceof Blob)
      ? await loadImageBuffer(event.eventLogo)
      : null;

  // Reference signage / diagrams, sourced from IMPI's own compiled plans.
  const signage = {
    incidentFlowchart: await loadImageBuffer(assetPath("assets/signage/incident-escalation-flowchart.png")),
    fireExtinguisherUsage: await loadImageBuffer(assetPath("assets/signage/fire-extinguisher-usage.png")),
    evacuationFlowchart: await loadImageBuffer(assetPath("assets/signage/evacuation-flowchart.png")),
    exitSign: await loadImageBuffer(assetPath("assets/signage/exit-sign.png")),
    assemblyPointSign: await loadImageBuffer(assetPath("assets/signage/assembly-point-sign.png")),
  };

  const images = { masterLogo, eventLogo, signage };

  // Resolve once per generation run: each signing role gets its own name ->
  // signature (+ designation, if known) lookup, so the Security Manager,
  // Event Safety Officer, and Risk Assessor blocks are each signed by the
  // actual person typed into that role's field — not all by one person.
  images.roleSignatures = {
    eventSafetyOfficer: await resolveSigner(event.eventSafetyOfficer),
    securityManager: await resolveSigner(event.securityManagerName),
    riskAssessor: await resolveSigner(event.riskAssessor),
  };
  images.organiserSigner = toggledModules.includes("appointmentLetter")
    ? await resolveSigner(event.organiserSignerName)
    : { signatureBuffer: null, designation: "" };
  images.safetyOfficerSignature = toggledModules.includes("appointmentLetter")
    ? (await resolveSigner(event.safetyOfficerName)).signatureBuffer
    : null;

  const jobs = [];
  if (toggledModules.includes("safety")) {
    jobs.push({ name: "Safety Management Plan", build: () => buildSafetyManagementPlan(event, images) });
  }
  if (toggledModules.includes("security")) {
    jobs.push({ name: "Security Management Plan", build: () => buildSecurityManagementPlan(event, images) });
  }
  if (toggledModules.includes("parking")) {
    jobs.push({ name: "Parking Management Plan", build: () => buildParkingManagementPlan(event, images) });
  }
  if (toggledModules.includes("riskAssessment")) {
    jobs.push({ name: "Event Risk Assessment", build: () => buildEventRiskAssessment(event, images) });
  }
  if (toggledModules.includes("traffic")) {
    jobs.push({ name: "Traffic Management Plan", build: () => buildTrafficManagementPlan(event, images) });
  }
  if (toggledModules.includes("evacuation")) {
    jobs.push({ name: "Emergency Evacuation Plan", build: () => buildEmergencyEvacuationPlan(event, images) });
  }
  if (toggledModules.includes("appointmentLetter")) {
    jobs.push({ name: "Safety Officer Appointment Letter", build: () => buildSafetyOfficerAppointmentLetter(event, images) });
  }

  const slug = slugify(event.eventName);
  const results = [];
  for (const job of jobs) {
    const doc = await job.build();
    const blob = await Packer.toBlob(doc);
    const filename = `${slug}-${slugify(job.name)}.docx`;
    saveAs(blob, filename);
    results.push(filename);
  }
  return results;
}
