import {
  Document,
  Paragraph,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  AlignmentType,
  ShadingType,
  PageOrientation,
} from "docx";
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
  RED,
  GOLD,
  DARK,
} from "./shared.js";
import { hazardsForEventType } from "../data/hazardLibrary.js";
import { CLASSIFICATION_CATEGORIES, computeRiskClassification, bandFromTotal } from "../data/riskClassification.js";

const A4_PORTRAIT = { width: 11906, height: 16838 };

function tinyRun(text, opts = {}) {
  return new TextRun({ text: text ?? "", size: opts.size || 15, color: opts.color || DARK, font: "Calibri", bold: !!opts.bold });
}

function tinyCell(text, { width, shading, color, bold, align } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shading ? { type: ShadingType.CLEAR, fill: shading } : undefined,
    margins: { top: 40, bottom: 40, left: 60, right: 60 },
    children: [
      new Paragraph({
        alignment: align || AlignmentType.LEFT,
        children: [tinyRun(text, { color: color || DARK, bold: !!bold })],
      }),
    ],
  });
}

const HAZARD_COL_WIDTHS = [2000, 1900, 1900, 450, 450, 450, 450, 450, 3500, 3500];
// Hazard, Cause, Result, A, B, C, D, R, Preventative, Controls

function riskShade(r) {
  if (r <= 6) return "D9EAD3"; // low - light green
  if (r <= 16) return "FFF2CC"; // medium - light gold
  if (r <= 32) return "FCE0C4"; // high - light orange
  return "F4C7C3"; // critical - light red
}

function buildHazardTable(rows) {
  const header = new TableRow({
        cantSplit: true,
    tableHeader: true,
    children: [
      tinyCell("Hazard", { width: HAZARD_COL_WIDTHS[0], shading: DARK, color: "FDDB07", bold: true }),
      tinyCell("Cause", { width: HAZARD_COL_WIDTHS[1], shading: DARK, color: "FDDB07", bold: true }),
      tinyCell("Possible Result", { width: HAZARD_COL_WIDTHS[2], shading: DARK, color: "FDDB07", bold: true }),
      tinyCell("A", { width: HAZARD_COL_WIDTHS[3], shading: DARK, color: "FDDB07", bold: true, align: AlignmentType.CENTER }),
      tinyCell("B", { width: HAZARD_COL_WIDTHS[4], shading: DARK, color: "FDDB07", bold: true, align: AlignmentType.CENTER }),
      tinyCell("C", { width: HAZARD_COL_WIDTHS[5], shading: DARK, color: "FDDB07", bold: true, align: AlignmentType.CENTER }),
      tinyCell("D", { width: HAZARD_COL_WIDTHS[6], shading: DARK, color: "FDDB07", bold: true, align: AlignmentType.CENTER }),
      tinyCell("R", { width: HAZARD_COL_WIDTHS[7], shading: DARK, color: "FDDB07", bold: true, align: AlignmentType.CENTER }),
      tinyCell("Preventative Measures", { width: HAZARD_COL_WIDTHS[8], shading: DARK, color: "FDDB07", bold: true }),
      tinyCell("Controls", { width: HAZARD_COL_WIDTHS[9], shading: DARK, color: "FDDB07", bold: true }),
    ],
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        cantSplit: true,
        children: [
          tinyCell(row.hazard, { width: HAZARD_COL_WIDTHS[0], bold: true }),
          tinyCell(row.cause, { width: HAZARD_COL_WIDTHS[1] }),
          tinyCell(row.result, { width: HAZARD_COL_WIDTHS[2] }),
          tinyCell(String(row.a), { width: HAZARD_COL_WIDTHS[3], align: AlignmentType.CENTER }),
          tinyCell(String(row.b), { width: HAZARD_COL_WIDTHS[4], align: AlignmentType.CENTER }),
          tinyCell(String(row.c), { width: HAZARD_COL_WIDTHS[5], align: AlignmentType.CENTER }),
          tinyCell(String(row.d), { width: HAZARD_COL_WIDTHS[6], align: AlignmentType.CENTER }),
          tinyCell(String(row.r), { width: HAZARD_COL_WIDTHS[7], shading: riskShade(row.r), bold: true, align: AlignmentType.CENTER }),
          tinyCell(row.prevent, { width: HAZARD_COL_WIDTHS[8] }),
          tinyCell(row.control, { width: HAZARD_COL_WIDTHS[9] }),
        ],
      })
  );

  return new Table({
    width: { size: HAZARD_COL_WIDTHS.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: HAZARD_COL_WIDTHS,
    rows: [header, ...dataRows],
  });
}

function buildClassificationTable(category, classResult) {
  const rows = [
    new TableRow({
        cantSplit: true,
      tableHeader: true,
      children: [
        tinyCell(category.title, { width: 8000, shading: RED, color: "FFFFFF", bold: true }),
        tinyCell("Rating", { width: 1800, shading: RED, color: "FFFFFF", bold: true, align: AlignmentType.CENTER }),
      ],
    }),
    ...category.items.map((item, idx) => {
      const scoreVal = classResult.raw?.[idx] ?? 0;
      const label = ["N/A", "Low", "Medium", "High"][scoreVal] || "N/A";
      return new TableRow({
        cantSplit: true,
        children: [
          tinyCell(item, { width: 8000 }),
          tinyCell(label, { width: 1800, align: AlignmentType.CENTER, bold: scoreVal > 0 }),
        ],
      });
    }),
  ];
  return new Table({ width: { size: 9800, type: WidthType.DXA }, columnWidths: [8000, 1800], rows });
}

export async function buildEventRiskAssessment(event, images) {
  const eventTypeTag = (event.raEventType || "Exhibition/Festival").toUpperCase();
  const hazardCategories = hazardsForEventType(eventTypeTag);

  const raClassification = event.raClassification || {};
  const classification = computeRiskClassification(raClassification);
  // attach raw per-item answers for table rendering
  classification.categoryResults.forEach((cr) => {
    cr.raw = raClassification[cr.id] || {};
  });

  const cover = await buildCoverPage({
    docTitle: "EVENT RISK ASSESSMENT",
    subTitle: "(SASREA Compliant)",
    eventLogoBuffer: images.eventLogo,
    masterLogoBuffer: images.masterLogo,
    event,
    extraDetailRows: [["Event Type", event.raEventType || "TBC"]],
  });

  const portrait1 = [
    new Paragraph({ children: [new PageBreak()] }),
    heading1("1. Document Control"),
    buildDocumentControlTable(event, [
      ["Event Type:", event.raEventType],
      ["Risk Assessor:", event.riskAssessor || "IMPI Risk Management Services"],
    ]),

    heading1("2. Purpose of the Risk Assessment"),
    paragraph(
      "This Event Risk Assessment identifies the hazards, associated risks, people who may be affected, and the control measures required to reduce risk to as low as reasonably practicable (ALARP) for the event described in Section 1."
    ),
    paragraph(
      `This assessment applies the hazard library relevant to the declared Event Type (${event.raEventType || "TBC"}). Section 7 lists only the hazards tagged for this event type; the full IMPI hazard library covers Marathon, Sports, and Exhibition/Festival events.`
    ),

    heading1("3. Legal and Regulatory Framework"),
    paragraph("This risk assessment has been developed in accordance with:"),
    bullet("South African Safety at Sports and Recreational Events Act (SASREA), Act 2 of 2010"),
    bullet("Occupational Health and Safety Act (OHS Act), Act 85 of 1993"),
    bullet("SANS 10366: Health and Safety at Live Events"),
    bullet("SANS 10400: National Building Regulations (temporary structures)"),
    bullet("Municipal Public Events & Safety By-Laws"),
    bullet("Joint Operations Committee (JOC) / Event Safety and Security Planning Committee (ESSPC) requirements"),

    heading1("4. Risk Assessment Methodology"),
    heading2("4.1 Hierarchy of Controls"),
    paragraph("Hazards and risks identified in this assessment are managed using the hierarchy of controls, ranked from most to least effective:"),
    bullet("Eliminate – remove the hazard entirely"),
    bullet("Reduce – reduce the quantity or degree of the hazard"),
    bullet("Substitute – replace with a safer alternative"),
    bullet("Isolate – separate the hazard from people"),
    bullet("Control – implement engineering/administrative controls to reduce risk to ALARP"),
    bullet("Personal Protection – require suitable PPE"),
    bullet("Discipline – managerial and self-discipline in applying the above"),
    heading2("4.2 People at Risk"),
    paragraph(
      "This assessment considers risk to essential staff, organisers, production/technical staff, contractors, performers/athletes/exhibitors (as applicable to the Event Type), and members of the public, including children, elderly attendees, and persons with hearing, learning, mental, physical, or visual impairment."
    ),
    heading2("4.3 Risk Assessment Process"),
    bullet("Stage 1: Review hazardous activities/areas to identify hazards and who may be affected"),
    bullet("Stage 2: Detailed assessment – identify hazards and people at risk, evaluate risk, identify existing controls"),
    bullet("Stage 3: Communicate risks and precautions to those affected"),
    bullet("Stage 4: Monitor, review, and revise the assessment"),
    heading2("4.4 Monitoring, Review and Responsibilities"),
    paragraph(
      "This risk assessment will be reviewed: before and at the final ESSPC meeting; following any major incident; when there is a significant change to the task, venue, or procedure; and at minimum annually for generic/template assessments."
    ),
    paragraph(
      "The Safety, Health & Environmental Manager is responsible for completing and communicating this assessment, providing guidance and training on risk assessment, and maintaining the review cycle. Staff are responsible for complying with the assessment and signing the Risk Assessment Acknowledgement Record."
    ),

    heading1("5. Event Risk Classification"),
    paragraph(
      "The overall event risk rating is determined by summing the assessed value of each item below (N/A = 0, Low = 1, Medium = 2, High = 3). This classification determines the level of safety governance required:"
    ),
    bullet("1 – 25 = LOW RISK (Safety Officer)"),
    bullet("26 – 50 = LOW RISK (Event Safety Committee)"),
    bullet("51 – 75 = MEDIUM RISK (Fully Representative VOC)"),
    bullet("76+ = HIGH RISK (Implement risk reduction efforts)"),
  ];

  const classificationTables = [];
  CLASSIFICATION_CATEGORIES.forEach((cat, i) => {
    const cr = classification.categoryResults[i];
    classificationTables.push(heading2(`${cat.title}  (category total: ${cr.total})`));
    classificationTables.push(buildClassificationTable(cat, cr));
    classificationTables.push(new Paragraph({ text: "", spacing: { after: 160 } }));
  });

  const band = classification.band;
  const totalBandBlock = [
    new Paragraph({
      spacing: { before: 120, after: 60 },
      children: [tinyRun(`TOTAL RISK RATING: ${classification.total}`, { size: 26, bold: true, color: DARK })],
    }),
    new Table({
      width: { size: 9800, type: WidthType.DXA },
      columnWidths: [9800],
      rows: [
        new TableRow({
        cantSplit: true,
          children: [
            new TableCell({
              width: { size: 9800, type: WidthType.DXA },
              shading: { type: ShadingType.CLEAR, fill: band.color },
              margins: { top: 120, bottom: 120, left: 160, right: 160 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `This event is classified by IMPI: RMS as a ${band.label} EVENT (${band.sub})`,
                      bold: true,
                      size: 24,
                      color: band.label === "MEDIUM RISK" ? DARK : "FFFFFF",
                      font: "Calibri",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: "", spacing: { after: 200 } }),
  ];

  const riskFrameworkSection = [
    heading1("6. Risk Rating Framework (A × B × C × D = R)"),
    paragraph(
      "Each hazard in Section 7 is scored against four factors – A: Injury Severity, B: Frequency of Occurrence, C: Potential Damage/Loss, D: Environmental Impact – multiplied together to produce a Risk Value (R), which is then banded as follows:"
    ),
    bullet("LOW (0–6): supervision, training, and standard safe work procedures"),
    bullet("MEDIUM (6–16): competent supervision and documented method statements"),
    bullet("HIGH (16–32): close competent supervision, permits to work"),
    bullet("CRITICAL (32–40): risk is intolerable without a change of method or risk transfer"),
  ];

  // ---- Section 7: landscape hazard tables ----
  const hazardSectionChildren = [
    heading1("7. Detailed Hazard Assessment"),
    paragraph(
      `The table below lists the hazards applicable to this event's declared Event Type (${event.raEventType || "TBC"}). Risk (R) values are colour-coded: green = Low, gold = Medium, orange = High, red = Critical.`
    ),
  ];
  hazardCategories.forEach((cat) => {
    hazardSectionChildren.push(heading2(cat.category));
    hazardSectionChildren.push(buildHazardTable(cat.rows));
    hazardSectionChildren.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  });

  // ---- Section 8-9: back to portrait ----
  const closingSection = [
    heading1("8. Scope, Responsibilities & Acknowledgement"),
    heading2("8.1 Scope"),
    paragraph(
      "This risk assessment covers the activities of event-specific staff during the build-up period, the event day(s), and the breakdown period. It does not cover the independent work activities of SAPS, Metro Police, sponsors, local media, venue staff, venue contractors, or event suppliers, who operate under their own risk assessments and command structures."
    ),
    heading2("8.2 People at Risk at the Event"),
    paragraph(
      "For this assessment, people at risk include artists/exhibitors/participants (as applicable), contractors, visitors, essential staff, and any person entering the event area for the purpose of attending the named event."
    ),
    heading2("8.3 Event Organiser Responsibilities"),
    paragraph(
      "The Event Organiser is responsible for supplying IMPI: RMS with the event plan, detailed layout drawings and venue maps, indication of any VIP or high-profile guests, and any specific safety, security, or medical needs of attendees."
    ),
    heading2("8.4 Review"),
    paragraph(
      "This risk assessment shall be reviewed before and at the final ESSPC meeting, following any major incident, and when significant changes occur in working practices or procedures. The event venue will adhere to all necessary control measures so far as is reasonably practicable; this is a continuously updated risk assessment and final safety arrangements on the day may vary from this version."
    ),
    paragraph(`This risk assessment was carried out by: ${event.riskAssessor || "IMPI Risk Management Services"}.`),
    heading2("8.5 Risk Assessment Acknowledgement"),
    paragraph(
      "All those involved in the work activity, directly or indirectly, must be informed of the risks to their health and safety and the precautions to be taken. Staff directly affected by this risk assessment will sign the Risk Assessment Acknowledgement Record below, confirming they have read and understood this assessment."
    ),
    buildAcknowledgementTable(),

    ...complianceDeclaration(
      "This Event Risk Assessment has been compiled in accordance with the South African Safety at Sports and Recreational Events Act (SASREA), the Occupational Health and Safety Act, and applicable municipal JOC/ESSPC requirements. All reasonable measures have been implemented to reduce risk to as low as reasonably practicable for the event described in Section 1.",
      ["Risk Assessor", "Event Safety Officer"]
    ),
  ];

  return new Document({
    sections: [
      {
        properties: { page: { size: A4_PORTRAIT }, titlePage: true },
        headers: { default: buildHeader("EVENT RISK ASSESSMENT", "(SASREA Compliant)", images.masterLogo), first: emptyHeader() },
        footers: { default: buildFooter(event), first: buildFooter(event) },
        children: [...cover, ...portrait1, ...classificationTables, ...totalBandBlock, ...riskFrameworkSection],
      },
      {
        properties: {
          page: {
            size: { ...A4_PORTRAIT, orientation: PageOrientation.LANDSCAPE },
            margin: { top: 900, bottom: 900, left: 720, right: 720 },
          },
        },
        headers: { default: buildHeader("EVENT RISK ASSESSMENT", "(SASREA Compliant)", images.masterLogo) },
        footers: { default: buildFooter(event) },
        children: hazardSectionChildren,
      },
      {
        properties: { page: { size: A4_PORTRAIT } },
        headers: { default: buildHeader("EVENT RISK ASSESSMENT", "(SASREA Compliant)", images.masterLogo) },
        footers: { default: buildFooter(event) },
        children: closingSection,
      },
    ],
  });
}

function buildAcknowledgementTable() {
  const colWidths = [3600, 3600, 2600];
  const header = new TableRow({
        cantSplit: true,
    tableHeader: true,
    children: [
      tinyCell("Name", { width: colWidths[0], shading: RED, color: "FFFFFF", bold: true, align: AlignmentType.CENTER }),
      tinyCell("Signature", { width: colWidths[1], shading: RED, color: "FFFFFF", bold: true, align: AlignmentType.CENTER }),
      tinyCell("Date", { width: colWidths[2], shading: RED, color: "FFFFFF", bold: true, align: AlignmentType.CENTER }),
    ],
  });
  const blankRows = Array.from({ length: 6 }).map(
    () =>
      new TableRow({
        cantSplit: true,
        children: [
          tinyCell("", { width: colWidths[0] }),
          tinyCell("", { width: colWidths[1] }),
          tinyCell("", { width: colWidths[2] }),
        ],
      })
  );
  return new Table({
    width: { size: colWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [header, ...blankRows],
  });
}
