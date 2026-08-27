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
  sectionImage,
} from "./shared.js";

export async function buildSecurityManagementPlan(event, images) {
  const cover = await buildCoverPage({
    docTitle: "SECURITY MANAGEMENT PLAN",
    subTitle: "(SASREA & PSIRA Compliant)",
    eventLogoBuffer: images.eventLogo,
    masterLogoBuffer: images.masterLogo,
    event,
  });

  const body = [
    new Paragraph({ children: [new PageBreak()] }),
    heading1("1. Document Control"),
    buildDocumentControlTable(event, [["PSIRA Registration:", event.psiraRegNumber || "2689596"]]),

    heading1("2. Purpose of the Security Management Plan"),
    paragraph(
      "The purpose of this Security Management Plan is to outline the security measures, procedures, and operational controls implemented to ensure the safety and security of all patrons, staff, performers, and stakeholders attending the event. This plan provides a structured approach to risk mitigation, crowd management, emergency response, and coordination with relevant authorities in compliance with applicable legislation and municipal requirements."
    ),

    heading1("3. Legal and Regulatory Framework"),
    bullet("South African Safety at Sports and Recreational Events Act (SASREA), Act 2 of 2010"),
    bullet("Private Security Industry Regulation Act (PSIRA), Act 56 of 2001"),
    bullet("Occupational Health and Safety Act (OHS Act), Act 85 of 1993"),
    bullet("SAPS National Instructions on Event Safety"),
    bullet(`${event.municipality || "Municipal"} By-laws`),
    bullet("Joint Operations Committee (JOC) requirements"),

    heading1("4. Event Overview"),
    paragraph(event.natureOfEvent || ""),

    heading1("5. Risk Classification"),
    paragraph(`The event has been categorised as ${event.riskCategory || "TBC"} based on the following factors:`),
    bullet(`Expected attendance of ${event.expectedAttendance || "TBC"} people`),
    bullet("Venue type and infrastructure"),
    bullet("Structured security, medical, and emergency response in place"),
    paragraph("Risk levels will be continuously monitored throughout the event."),

    heading1("6. Security Command Structure"),
    bullet("Event Safety Officer (ESO): Overall safety oversight and JOC liaison"),
    bullet("Security Manager: Operational command of all security functions"),
    bullet(`Supervisors: ${event.supervisorsCount || "TBC"} deployed, area-based management and reporting`),
    bullet(`Security Officers: ${event.securityOfficersCount || "TBC"} deployed, execution of access control, patrols, and response duties`),

    heading1("7. Security Personnel Deployment"),
    paragraph(
      `Total security personnel deployed: ${event.totalSecurityPersonnel || "TBC"}. Deployment is structured across the build-up phase, event-day operations, and post-event/breakdown phase, in accordance with a formal operational posting sheet aligned with the approved risk classification, venue layout, expected attendance, and SASREA/PSIRA requirements.`
    ),

    heading1("8. Access Control Procedures"),
    paragraph(event.accessControlPoints || "Access to the venue will be strictly controlled through designated entry points."),
    bullet("Ticket verification"),
    bullet("Visual screening and bag checks where applicable"),
    bullet("Denial of entry to unauthorized or intoxicated patrons"),
    bullet("Credential-controlled access to VIP and operational areas"),

    heading1("9. Crowd Management Plan"),
    bullet("Controlled ingress and egress"),
    bullet("Monitoring of crowd density"),
    bullet("Clear public circulation routes"),
    bullet("Prevention of overcrowding and congestion"),

    heading1("10. Perimeter and Zone Security"),
    paragraph(event.noGoZones ? `No-go / restricted zones: ${event.noGoZones}` : "The venue will be divided into clearly defined public, VIP, operational, and restricted zones."),

    heading1("11. Command & Control Point (CCP)"),
    paragraph(`Location: ${event.commandControlLocation || "TBC"}. The CCP will serve as the communication hub for incident reporting, decision-making, and coordination with SAPS, EMS, and Fire Services.`),

    heading1("12. Communication & Radio Plan"),
    paragraph("Two-way radios will be issued to supervisors and key personnel. A structured call-sign system will be implemented to ensure clear communication. Emergency communications will take priority."),

    heading1("13. Incident Management Procedures"),
    bullet("Disorderly conduct"),
    bullet("Medical emergencies"),
    bullet("Fire hazards"),
    bullet("Security threats"),
    paragraph("All incidents will be logged in an Occurrence Book and escalated where required."),
    ...sectionImage(images.signage?.incidentFlowchart, {
      width: 280,
      height: 420,
      caption: "Incident escalation and command structure.",
    }),

    heading1("14. Emergency and Evacuation Procedures"),
    paragraph(`Assembly point(s): ${event.assemblyPoints || "TBC"}. Full procedures are detailed in the accompanying Emergency Evacuation Plan.`),
    ...sectionImage(images.signage?.exitSign, { width: 90, height: 90 }),
    ...sectionImage(images.signage?.assemblyPointSign, {
      width: 140,
      height: 140,
      caption: "Standard emergency exit and assembly point signage to be displayed on site.",
    }),

    heading1("15. Medical and First Aid Coordination"),
    paragraph(`Medical service provider: ${event.medicalProvider || "TBC"}. Security personnel will assist medical teams as required.`),

    heading1("16. Alcohol and Prohibited Items Control"),
    paragraph(
      event.alcoholOnSite === "Yes"
        ? "Alcohol is served on site. Consumption will be monitored, service to intoxicated persons prevented, and prohibited items confiscated."
        : "No alcohol service anticipated. Prohibited items will be confiscated where identified."
    ),

    heading1("17. Use of Force and Search Procedures"),
    paragraph("All searches and interventions will be conducted lawfully and respectfully. Use of force will be limited to reasonable and proportional measures as permitted by law. All incidents involving force will be documented."),

    heading1("18. Post-Event Procedures"),
    bullet("Controlled crowd dispersal"),
    bullet("Continued security presence until the venue is cleared"),
    bullet("Final incident reporting"),
    bullet("Operational debrief with organizers"),

    heading1("19. JOC and Authority Integration"),
    paragraph(`Coordination with: ${event.jocAuthority || "SAPS, Metro Police, Disaster Management, EMS and Fire Services"}. All instructions issued by authorities will be complied with.`),

    ...complianceDeclaration(
      "This Security Management Plan has been compiled in accordance with the South African Safety at Sports and Recreational Events Act (SASREA), the Private Security Industry Regulation Act (PSIRA), the Occupational Health and Safety Act, and the requirements of the relevant Joint Operations Committee (JOC). All reasonable measures have been implemented to ensure the safety and security of patrons, staff, and stakeholders.",
      [{ label: "Security Manager", signatureBuffer: images.roleSignatures.securityManager.signatureBuffer, date: event.datePrepared }, { label: "Event Safety Officer", signatureBuffer: images.roleSignatures.eventSafetyOfficer.signatureBuffer, date: event.datePrepared }]
    ),
  ];

  return new Document({
    sections: [
      {
        properties: { titlePage: true },
        headers: { default: buildHeader("SECURITY MANAGEMENT PLAN", "(SASREA & PSIRA Compliant)", images.masterLogo), first: emptyHeader() },
        footers: { default: buildFooter(event), first: emptyFooter() },
        children: [...cover, ...body],
      },
    ],
  });
}
