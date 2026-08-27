import { Document, Paragraph, PageBreak } from "docx";
import {
  buildCoverPage,
  buildDocumentControlTable,
  buildFooter,
  buildHeader,
  emptyHeader,
  emptyFooter,
  heading1,
  heading2,
  paragraph,
  bullet,
  complianceDeclaration,
} from "./shared.js";

function linesToBullets(text, fallback = []) {
  const lines = (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (lines.length ? lines : fallback).map((l) => bullet(l));
}

export async function buildTrafficManagementPlan(event, images) {
  const cover = await buildCoverPage({
    docTitle: "TRAFFIC MANAGEMENT PLAN",
    subTitle: "(SASREA & National Road Traffic Act Compliant)",
    eventLogoBuffer: images.eventLogo,
    masterLogoBuffer: images.masterLogo,
    event,
  });

  const body = [
    new Paragraph({ children: [new PageBreak()] }),
    heading1("1. Document Control"),
    buildDocumentControlTable(event, [["Security Provider:", "IMPI Risk Management Services"]]),

    heading1("2. Purpose of the Traffic Management Plan"),
    paragraph(
      "This Traffic Management Plan outlines the road closure, detour, signage, and traffic control measures implemented for the event to ensure:"
    ),
    bullet("Safe and orderly traffic flow around the event footprint"),
    bullet("Minimised disruption to surrounding road users"),
    bullet("Clear, signed detour routes where roads are closed or restricted"),
    bullet("Unobstructed access for emergency services at all times"),
    bullet(`Alignment with ${event.municipality || "municipal"} JOC and traffic department requirements`),

    heading1("3. Legal and Regulatory Framework"),
    paragraph("This plan complies with:"),
    bullet("National Road Traffic Act, Act 93 of 1996, and Regulations"),
    bullet("SASREA Act 2 of 2010"),
    bullet("PSIRA Act 56 of 2001"),
    bullet("OHS Act 85 of 1993"),
    bullet(`${event.municipality || "Municipal"} By-Laws`),
    bullet("SAPS / Metro Police Traffic Guidelines"),
    bullet("JOC / ESSPC requirements"),

    heading1("4. Traffic Impact Overview"),
    paragraph("The following roads and intersections are affected by the event:"),
    ...linesToBullets(event.affectedRoads, ["TBC – to be confirmed with the municipal traffic department"]),

    heading1("5. Road Closures"),
    paragraph("The following closures apply (road, date, time window):"),
    ...linesToBullets(event.roadClosures, ["No full road closures planned — TBC"]),

    heading1("6. Detour Routes"),
    paragraph("Signed detour routes will be established as follows:"),
    ...linesToBullets(event.detourRoutes, ["TBC – to be confirmed with the municipal traffic department"]),

    heading1("7. Traffic Control Measures"),
    bullet("Directional and warning signage placed in advance of all closures and detours"),
    bullet("Barricades and cones at all closure points"),
    bullet("Night visibility measures (reflective signage, lighting) where applicable"),
    bullet("Continuous monitoring of traffic flow throughout build-up, event, and breakdown phases"),

    heading1("8. Traffic Personnel Deployment"),
    bullet(`${event.trafficOfficersCount || "TBC"} x SAPS / Metro Traffic Officers`),
    bullet(`${event.trafficMarshalsCount || "TBC"} x IMPI Traffic Marshals`),
    paragraph("Marshals will be deployed at all closure points, detour junctions, and pedestrian crossing points, and will adhere to the escalation and reporting protocol."),

    heading1("9. Emergency Vehicle Access"),
    paragraph("The following measures ensure uninterrupted emergency access throughout the event:"),
    ...linesToBullets(event.emergencyAccessRoutes, [
      "Dedicated emergency access route maintained at all times",
      "No obstruction of fire routes or access roads",
      "Direct access maintained for EMS, SAPS, and Fire Services",
    ]),

    heading1("10. Public Communication & Notification"),
    paragraph(`Notice period / method: ${event.noticePeriod || "TBC"}`),
    bullet("Advance notice provided to affected residents, businesses, and road users"),
    bullet("On-site directional and advisory signage from build-up phase onward"),
    bullet("Coordination with local media / community channels where required"),

    heading1("11. Contingency Planning"),
    bullet("Contingency marshalling in the event of unplanned congestion"),
    bullet("Rapid-response protocol for blocked emergency routes"),
    bullet("Weather impact mitigation (visibility, road surface conditions)"),

    heading1("12. Integration with JOC & Authorities"),
    paragraph("The traffic operation integrates with:"),
    bullet("SAPS"),
    bullet(event.trafficDepartment || `${event.municipality || "Municipal"} Traffic Department`),
    bullet("EMS"),
    bullet("Disaster Management"),

    ...complianceDeclaration(
      `This Traffic Management Plan has been compiled in accordance with the National Road Traffic Act, SASREA, and ${event.municipality || "municipal"} JOC requirements. All reasonable measures have been implemented to ensure safe traffic flow and emergency access throughout the event.`,
      ["Security Manager", "Event Safety Officer"],
      { signatureBuffer: images.preparerSignature, date: event.datePrepared }
    ),
  ];

  return new Document({
    sections: [
      {
        properties: { titlePage: true },
        headers: { default: buildHeader("TRAFFIC MANAGEMENT PLAN", "(SASREA & National Road Traffic Act Compliant)", images.masterLogo), first: emptyHeader() },
        footers: { default: buildFooter(event), first: emptyFooter() },
        children: [...cover, ...body],
      },
    ],
  });
}
