import { Document, Paragraph, Table, TableRow, TableCell, WidthType, PageBreak } from "docx";
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
  sectionImage,
} from "./shared.js";

export async function buildSafetyManagementPlan(event, images) {
  const cover = await buildCoverPage({
    docTitle: "SAFETY MANAGEMENT PLAN",
    subTitle: "(SASREA & OHS Act Compliant)",
    eventLogoBuffer: images.eventLogo,
    masterLogoBuffer: images.masterLogo,
    event,
  });

  const hazards = (event.hazardsPresent || []).length
    ? event.hazardsPresent
    : ["Slips, trips, and falls", "Electrical hazards", "Temporary structures", "Congestion points"];

  const body = [
    new Paragraph({ children: [new PageBreak()] }),
    heading1("1. Document Control"),
    buildDocumentControlTable(event, [["Event Safety Officer:", event.eventSafetyOfficer]]),

    heading1("2. Purpose of the Safety Management Plan"),
    paragraph(
      "This Safety Management Plan outlines the health, safety, and emergency management measures implemented to protect patrons, staff, contractors, and stakeholders during the event, in compliance with SASREA, the Occupational Health and Safety Act, and municipal JOC requirements."
    ),

    heading1("3. Legal and Regulatory Framework"),
    bullet("South African Safety at Sports and Recreational Events Act (SASREA), Act 2 of 2010"),
    bullet("Occupational Health and Safety Act (OHS Act), Act 85 of 1993"),
    bullet("National Building Regulations"),
    bullet("Municipal Public Events & Safety By-Laws"),
    bullet("SASREA Safety Requirements"),

    heading1("4. Event Overview"),
    paragraph(event.natureOfEvent || ""),
    heading2("Operational Phases"),
    heading2("Build-Up Phase"),
    paragraph(
      "The build-up phase includes venue preparation, equipment installation, staging, technical setup, and safety inspections. All contractors and service providers will be inducted on site-specific safety requirements. Temporary structures and equipment will be inspected to ensure compliance with applicable safety regulations before public access."
    ),
    heading2("Event Day / Live Operations"),
    paragraph(
      "The event phase commences with final safety checks and operational briefings, followed by controlled public ingress, live event operations, and regulated egress. Safety, security, medical, and operational teams will be deployed throughout the venue for the full duration of the event to monitor conditions, manage risks, and respond to incidents or emergencies as required."
    ),
    heading2("Breakdown Phase"),
    paragraph(
      "The breakdown phase begins once the venue has been cleared of patrons and an all-clear has been confirmed. Equipment dismantling and load-out activities will be conducted under controlled conditions, with continued safety oversight to ensure the orderly removal of structures and restoration of the venue to its pre-event condition."
    ),

    heading1("5. Safety Risk Classification"),
    paragraph(`This event has been classified as ${event.riskCategory || "TBC"} based on:`),
    bullet("Venue type and infrastructure"),
    bullet("Audience profile and expected attendance"),
    bullet("Nature of activities"),
    bullet("Environmental factors"),

    heading1("6. Safety Command Structure"),
    bullet(`Event Safety Officer: ${event.eventSafetyOfficer || "TBC"}`),
    bullet(`Evacuation Marshals: ${event.evacuationMarshalsCount || "TBC"}`),
    bullet(`Medical Coordinator: ${event.medicalCoordinatorName || "TBC"}`),
    paragraph("Clear reporting and escalation structure applies."),

    heading1("7. Roles, Appointments & Responsibilities"),
    paragraph("Responsibilities relating to:"),
    bullet("Safety inspections"),
    bullet("Hazard identification"),
    bullet("Emergency coordination"),
    bullet("Contractor compliance"),

    heading1("8. Safety Administration & Logistics"),
    bullet("Occurrence book management"),
    bullet("Pre-event safety inspections"),
    bullet("Incident investigations"),
    bullet("Safety reporting"),

    heading1("9. Medical & First Aid Management"),
    paragraph(`Medical service provider: ${event.medicalProvider || "TBC"}`),
    bullet("Casualty classification"),
    bullet("Patient transfer protocols"),

    heading1("10. Fire Safety Management"),
    paragraph(`Number of fire wardens deployed: ${event.fireWardensCount || "TBC"}`),
    bullet("Fire hazards identification"),
    bullet("Fire equipment placement"),
    bullet("Emergency response steps"),
    ...sectionImage(images.signage?.fireExtinguisherUsage, {
      width: 340,
      height: 286,
      caption: "Fire extinguisher operation (PASS method) and standard fire safety signage.",
    }),

    heading1("11. Hazard Identification & Risk Control"),
    ...hazards.map((h) => bullet(h)),

    heading1("12. Incident Command & Communication"),
    paragraph("Incident escalation process and coordination between Safety, Security, Medical, Emergency Services and Organizers."),
    ...sectionImage(images.signage?.incidentFlowchart, {
      width: 300,
      height: 450,
      caption: "Incident escalation and command structure.",
    }),

    heading1("13. Emergency & Evacuation Procedures"),
    paragraph(`Assembly point(s): ${event.assemblyPoints || "TBC"}`),
    paragraph(
      "Evacuation triggers, exit management, communication methods, and special-needs evacuation procedures are detailed in the accompanying Emergency Evacuation Plan."
    ),
    ...sectionImage(images.signage?.evacuationFlowchart, {
      width: 300,
      height: 450,
      caption: "Evacuation and emergency response flow, including special-needs and visitor handling.",
    }),

    heading1("14. Assembly Point Management"),
    paragraph("Control of assembly points, accountability, and crowd safety post-evacuation."),
    ...sectionImage(images.signage?.exitSign, { width: 90, height: 90 }),
    ...sectionImage(images.signage?.assemblyPointSign, {
      width: 150,
      height: 150,
      caption: "Standard emergency exit and assembly point signage to be displayed on site.",
    }),

    heading1("15. All-Clear & Event Resumption Procedure"),
    paragraph("Process for declaring an all-clear and determining whether the event may resume."),

    heading1("16. Training & Induction"),
    paragraph(`Safety induction/training date: ${event.trainingDate || "TBC"}`),
    bullet("Emergency procedures"),
    bullet("Evacuation roles"),
    bullet("Fire response"),
    bullet("Medical reporting"),

    heading1("17. Responsibility Matrix"),
    buildResponsibilityMatrixTable(),

    heading1("18. Post-Event Safety Procedures"),
    bullet("Stand-down inspections"),
    bullet("Incident close-out"),
    bullet("Site restoration"),

    heading1("19. JOC and Authority Integration"),
    paragraph(`Coordination with: ${event.jocAuthority || "SAPS, Metro Police, Disaster Management, EMS and Fire Services"}`),

    ...complianceDeclaration(
      "This Safety Management Plan has been compiled in accordance with SASREA, the Occupational Health and Safety Act, and municipal JOC requirements. All reasonable measures have been implemented to ensure safety throughout the event life cycle.",
      ["Event Safety Officer"]
    ),
  ];

  return new Document({
    sections: [
      {
        properties: { titlePage: true },
        headers: { default: buildHeader("SAFETY MANAGEMENT PLAN", "(SASREA & OHS Act Compliant)", images.masterLogo), first: emptyHeader() },
        footers: { default: buildFooter(event), first: emptyFooter() },
        children: [...cover, ...body],
      },
    ],
  });
}

function buildResponsibilityMatrixTable() {
  const rows = [
    ["Secure scenes during emergencies", "SAPS"],
    ["Patient treatment and transport to medical facilities", "To be Confirmed"],
    ["Evacuation of crowd", "IMPI: RMS"],
    ["Announcements of emergencies", "Organizers"],
    ["Liaison with next of kin for casualties", "SAPS"],
    ["Press statement and release", "Organizers"],
    ["Fire safety inspection", "Fire Services"],
    ["Coordination of additional resources", "Disaster Management"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [paragraph("Activity")] }),
          new TableCell({ children: [paragraph("Role Player")] }),
        ],
      }),
      ...rows.map(
        ([a, b]) =>
          new TableRow({
            children: [new TableCell({ children: [paragraph(a)] }), new TableCell({ children: [paragraph(b)] })],
          })
      ),
    ],
  });
}
