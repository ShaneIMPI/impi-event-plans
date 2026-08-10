import { Packer } from "docx";
import { saveAs } from "file-saver";
import { loadImageBuffer } from "./shared.js";
import { buildSafetyManagementPlan } from "./safetyPlan.js";
import { buildSecurityManagementPlan } from "./securityPlan.js";
import { buildParkingManagementPlan } from "./parkingPlan.js";
import { buildEventRiskAssessment } from "./riskAssessmentPlan.js";
import { buildTrafficManagementPlan } from "./trafficPlan.js";
import { buildEmergencyEvacuationPlan } from "./evacuationPlan.js";
import { IMPI } from "../data/companyInfo.js";

function slugify(text) {
  return (text || "event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Resolves a public-asset path against the deployed site's base URL, so it
// works whether served at the domain root (local dev) or under a subpath
// like /impi-event-plans/ (GitHub Pages project sites).
function assetPath(path) {
  return `${import.meta.env?.BASE_URL || "/"}${path.replace(/^\//, "")}`;
}

export async function generateSelectedDocuments(event, toggledModules) {
  const masterLogo = await loadImageBuffer(IMPI.masterLogoPath);
  const eventLogo = event.eventLogo instanceof Blob ? await loadImageBuffer(event.eventLogo) : null;

  // Reference signage / diagrams, sourced from IMPI's own compiled plans.
  const signage = {
    incidentFlowchart: await loadImageBuffer(assetPath("assets/signage/incident-escalation-flowchart.png")),
    fireExtinguisherUsage: await loadImageBuffer(assetPath("assets/signage/fire-extinguisher-usage.png")),
    evacuationFlowchart: await loadImageBuffer(assetPath("assets/signage/evacuation-flowchart.png")),
    exitSign: await loadImageBuffer(assetPath("assets/signage/exit-sign.png")),
    assemblyPointSign: await loadImageBuffer(assetPath("assets/signage/assembly-point-sign.png")),
  };

  const images = { masterLogo, eventLogo, signage };

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
