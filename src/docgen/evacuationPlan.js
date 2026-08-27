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

export async function buildEmergencyEvacuationPlan(event, images) {
  const cover = await buildCoverPage({
    docTitle: "EMERGENCY EVACUATION PLAN",
    subTitle: "(SASREA & OHS Act Compliant)",
    eventLogoBuffer: images.eventLogo,
    masterLogoBuffer: images.masterLogo,
    event,
  });

  const body = [
    new Paragraph({ children: [new PageBreak()] }),
    heading1("1. Document Control"),
    buildDocumentControlTable(event, [["Event Safety Provider:", "IMPI Risk Management Services"]]),

    heading1("2. Purpose of the Emergency Evacuation Plan"),
    paragraph(
      "This Emergency Evacuation Plan sets out the procedures for the safe, orderly evacuation of patrons, staff, contractors, and stakeholders from the venue in the event of an emergency, in compliance with SASREA, the Occupational Health and Safety Act, and municipal JOC requirements."
    ),

    heading1("3. Legal and Regulatory Framework"),
    bullet("South African Safety at Sports and Recreational Events Act (SASREA), Act 2 of 2010"),
    bullet("Occupational Health and Safety Act (OHS Act), Act 85 of 1993"),
    bullet("National Building Regulations"),
    bullet("Municipal Public Events & Safety By-Laws"),
    bullet("Joint Operations Committee (JOC) / ESSPC requirements"),

    heading1("4. Evacuation Triggers"),
    paragraph("An evacuation may be initiated by the Event Safety Officer in response to any of the following:"),
    ...linesToBullets(event.evacuationTriggers, [
      "Fire / smoke detected",
      "Structural instability or failure",
      "Bomb threat or suspicious device",
      "Severe weather (lightning, high wind, flash flooding)",
      "Crowd surge or crowd disorder beyond safe control",
      "Instruction from SAPS, Fire Services, or Disaster Management",
    ]),

    heading1("5. Evacuation Command Structure"),
    bullet("Event Safety Officer (ESO): Authorises and directs the evacuation, liaises with JOC and emergency services"),
    bullet("Evacuation Marshals: Guide patrons to emergency exits and assembly points"),
    bullet("Security Personnel: Assist with crowd control, secure emergency routes, and support scene preservation where required"),
    bullet("Medical Coordinator: Directs casualty management during and after evacuation"),
    paragraph("All personnel adhere to the escalation and reporting protocol set out in the Safety Management Plan."),

    heading1("6. Emergency Exits and Routes"),
    paragraph("The following emergency exits and routes are designated for this event:"),
    ...linesToBullets(event.emergencyExits, ["TBC — to be confirmed against the approved venue layout"]),
    paragraph("All emergency exits will remain unlocked, clearly signed, and unobstructed for the full duration of the event."),

    heading1("7. Assembly Points"),
    paragraph("The following assembly point(s) are designated for this event:"),
    ...linesToBullets(event.assemblyPoints, ["TBC — to be confirmed against the approved venue layout"]),
    paragraph("Evacuation Marshals will conduct headcounts / accountability checks at each assembly point once evacuation is complete."),

    heading1("8. Evacuation Procedure"),
    heading2("8.1 Alert"),
    paragraph("The Event Safety Officer confirms the trigger and authorises evacuation via the Command & Control Point."),
    heading2("8.2 Evacuate"),
    bullet("PA announcement and/or air horn signal issued to initiate evacuation"),
    bullet("Marshals and security direct patrons calmly to the nearest safe emergency exit"),
    bullet("Vehicles and equipment movement halted in evacuation routes"),
    bullet("Priority given to persons with special needs, children, and the elderly"),
    heading2("8.3 Assemble"),
    bullet("Patrons directed to the designated assembly point(s)"),
    bullet("Marshals conduct headcounts and report to the Event Safety Officer"),
    bullet("Missing persons reported immediately to SAPS / Command & Control"),
    heading2("8.4 All-Clear / Resumption"),
    paragraph(`All-clear may only be declared by: ${event.allClearAuthority || "the Event Safety Officer, in consultation with SAPS/Fire Services"}.`),
    paragraph("The event may only resume once the venue has been inspected and confirmed safe by the relevant authority."),

    heading1("9. Special Needs Evacuation"),
    paragraph("Provisions for patrons with disabilities or special needs:"),
    ...linesToBullets(event.specialNeedsProvisions, [
      "Dedicated marshal assistance for wheelchair users and persons with mobility impairments",
      "Designated refuge point identified where full evacuation is not immediately possible",
      "Priority accountability at assembly point",
    ]),

    heading1("10. Communication During Evacuation"),
    paragraph("Two-way radios and the structured call-sign system (per the Security Management Plan) remain in use throughout the evacuation. Emergency communications take priority, and all updates are reported directly to the Command & Control Point."),
    ...(event.commandControlLocation
      ? [paragraph(`Command & Control Point location: ${event.commandControlLocation}`)]
      : []),

    heading1("11. Post-Evacuation Procedures"),
    bullet("Stand-down inspection of the venue by the Event Safety Officer / relevant authority"),
    bullet("Incident report completed and logged in the Occurrence Book"),
    bullet("Debrief with organisers, security, and medical teams"),
    bullet("Site restoration and resumption planning, where applicable"),

    heading1("12. Training and Briefing"),
    paragraph(`${event.evacuationMarshalsCount || "TBC"} x Evacuation Marshals will be briefed prior to the event on:`),
    bullet("Site layout, emergency exits, and assembly points"),
    bullet("Evacuation triggers and escalation procedures"),
    bullet("Special needs assistance procedures"),
    bullet("Communication protocols"),

    heading1("13. JOC and Authority Integration"),
    paragraph("The evacuation plan integrates with:"),
    bullet("SAPS"),
    bullet(event.jocAuthority || `${event.municipality || "Municipal"} Disaster Management`),
    bullet("EMS and Fire Services"),

    ...complianceDeclaration(
      "This Emergency Evacuation Plan has been compiled in accordance with SASREA, the Occupational Health and Safety Act, and applicable municipal JOC requirements. All reasonable measures have been implemented to ensure the safe evacuation of patrons, staff, and stakeholders in an emergency.",
      ["Event Safety Officer", "Security Manager"],
      { signatureBuffer: images.preparerSignature, date: event.datePrepared }
    ),
  ];

  return new Document({
    sections: [
      {
        properties: { titlePage: true },
        headers: { default: buildHeader("EMERGENCY EVACUATION PLAN", "(SASREA & OHS Act Compliant)", images.masterLogo), first: emptyHeader() },
        footers: { default: buildFooter(event), first: emptyFooter() },
        children: [...cover, ...body],
      },
    ],
  });
}
