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

export async function buildParkingManagementPlan(event, images) {
  const cover = await buildCoverPage({
    docTitle: "PARKING MANAGEMENT PLAN",
    subTitle: "(SASREA & PSIRA Compliant)",
    eventLogoBuffer: images.eventLogo,
    masterLogoBuffer: images.masterLogo,
    event,
  });

  const zoneLines = (event.parkingZonesDescription || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const body = [
    new Paragraph({ children: [new PageBreak()] }),
    heading1("1. Document Control"),
    buildDocumentControlTable(event, [["Security Provider:", "IMPI Risk Management Services"]]),

    heading1("2. Purpose of the Parking Management Plan"),
    paragraph(
      "This Parking Management Plan outlines the vehicle control measures, parking allocations, traffic flow systems, and safety procedures implemented to ensure:"
    ),
    bullet("Safe vehicle movement"),
    bullet("Efficient ingress and egress"),
    bullet("Separation of pedestrian and vehicle routes"),
    bullet("Emergency access compliance"),
    bullet(`Alignment with ${event.municipality || "municipal"} JOC requirements`),

    heading1("3. Legal and Regulatory Framework"),
    paragraph("This plan complies with:"),
    bullet("SASREA Act 2 of 2010"),
    bullet("PSIRA Act 56 of 2001"),
    bullet("National Road Traffic Act"),
    bullet("OHS Act 85 of 1993"),
    bullet(`${event.municipality || "Municipal"} By-Laws`),
    bullet("SAPS Event Safety Guidelines"),
    bullet("JOC requirements"),

    heading1("4. Parking Overview"),
    paragraph("The venue parking layout has been divided into the following controlled zones:"),
    ...linesToBullets(event.parkingZonesDescription, [
      "General Parking — primary parking for attendees, managed in structured grid formation",
      "Overflow Parking — activated once primary capacity reaches the defined trigger",
      "Staff Parking — restricted to accredited staff and suppliers, controlled access only",
      "Artist & Handicapped Parking — access-controlled, in close proximity to venue access",
    ]),

    heading1("5. Traffic Flow Management"),
    heading2("Ingress"),
    bullet(`Entry via ${event.ingressPoint || "the designated main access point"}`),
    bullet("Vehicles directed by marshals into General Parking, Overflow (if required), or Staff/Artist access (controlled)"),
    heading2("Egress"),
    bullet("Controlled exit using the internal road network"),
    bullet("Marshals deployed to prevent congestion and prioritise safe dispersal"),
    heading2("Pedestrian Flow"),
    bullet(`Pedestrian walkway established: ${event.pedestrianWalkway || "TBC"}`),
    bullet("Separated from vehicle routes"),

    heading1("6. Parking Personnel Deployment"),
    bullet(`${event.parkingMarshalsCount || "TBC"} x Parking Marshals`),
    bullet(`${event.entryExitOfficersCount || "TBC"} x Parking Entry/Exit Officers`),
    bullet(`${event.rovingOfficersCount || "TBC"} x Parking Roving Reaction Officers`),
    heading2("Deployment Positions"),
    ...linesToBullets(event.deploymentPositions, [
      "Gate Control",
      "Primary internal control point",
      "General Parking access",
      "Overflow Parking access",
      "Staff Parking control",
      "Artist/Disabled control",
      "Internal route monitoring",
    ]),
    paragraph("All personnel will adhere to the escalation and reporting protocol."),

    heading1("7. Signage and Traffic Control"),
    bullet("Directional signage at entry points"),
    bullet("Parking zone identification signage"),
    bullet("No-parking and restricted access indicators"),
    bullet("Night visibility measures (lighting towers recommended)"),

    heading1("8. Safety and Emergency Access"),
    bullet("Emergency lanes are always maintained"),
    bullet("No obstruction of fire routes or access roads"),
    bullet("Direct access maintained for EMS, SAPS, and Fire Services"),

    heading1("9. Contingency Planning"),
    bullet(`Overflow activation protocol — triggered at ${event.overflowTrigger || "±80% primary capacity"}`),
    bullet("Traffic congestion control measures"),
    bullet("Weather impact mitigation (mud / access issues)"),

    heading1("10. Integration with JOC & Authorities"),
    paragraph("The parking operation integrates with:"),
    bullet("SAPS"),
    bullet(event.trafficDepartment || `${event.municipality || "Municipal"} Traffic Department`),
    bullet("EMS"),
    bullet("Disaster Management"),

    ...complianceDeclaration(
      `This Parking Management Plan has been compiled in accordance with SASREA, PSIRA and ${event.municipality || "municipal"} JOC requirements. All reasonable measures have been implemented to ensure safe vehicle and pedestrian management.`,
      ["Security Manager", "Event Safety Officer"]
    ),
  ];

  return new Document({
    sections: [
      {
        properties: { titlePage: true },
        headers: { default: buildHeader("PARKING MANAGEMENT PLAN", "(SASREA & PSIRA Compliant)", images.masterLogo), first: emptyHeader() },
        footers: { default: buildFooter(event), first: emptyFooter() },
        children: [...cover, ...body],
      },
    ],
  });
}
