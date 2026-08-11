import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Header,
  Footer,
  AlignmentType,
  BorderStyle,
  ImageRun,
  VerticalAlign,
} from "docx";
import { IMPI } from "../data/companyInfo.js";

// This letter uses its own distinct visual style (matching the approved
// template Shane supplied) — a simple navy-blue letterhead, not the red/gold
// house style used by the six SASREA plan documents. Do not restyle this to
// match shared.js without checking with Shane first.
const BLUE = "1F4E79";
const DARK = "231F20";
const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function run(text, opts = {}) {
  return new TextRun({ text, size: opts.size || 22, color: opts.color || DARK, font: "Calibri", bold: !!opts.bold, italics: !!opts.italics });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({ spacing: { after: opts.after ?? 160 }, children: [run(text, opts)] });
}

function subheading(text) {
  return new Paragraph({
    spacing: { before: 260, after: 120 },
    keepNext: true,
    children: [new TextRun({ text, bold: true, color: BLUE, font: "Calibri", size: 26 })],
  });
}

function signatureLine(label) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [run(`${label}: `), run("______________________________")],
  });
}

function buildLetterHeader() {
  return new Header({
    children: [
      new Paragraph({
        spacing: { after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "BFBFBF", space: 8 } },
        children: [new TextRun({ text: "Safety Officer Appointment Letter", bold: true, color: BLUE, font: "Calibri", size: 40 })],
      }),
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: "(Issued in terms of Section 4 of the Safety at Sports and Recreational Events Act, 2010)",
            color: DARK,
            font: "Calibri",
            size: 20,
          }),
        ],
      }),
    ],
  });
}

function buildLetterFooter(masterLogoBuffer) {
  return new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 78, type: WidthType.PERCENTAGE },
                borders: NO_BORDERS,
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text:
                          "This appointment is made in accordance with the Safety at Sports and Recreational Events Act, 2010 (Act No. 2 of 2010). The appointed Safety Officer is responsible for ensuring compliance with the Act, including event risk categorization, safety planning, and liaison with the Event Safety and Security Planning Committee and relevant authorities.",
                        size: 15,
                        color: DARK,
                        font: "Calibri",
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                borders: NO_BORDERS,
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: masterLogoBuffer
                      ? [new ImageRun({ data: masterLogoBuffer, transformation: { width: 110, height: 56 } })]
                      : [],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function detailsTable(event) {
  const rows = [
    ["Name of Safety Officer:", event.safetyOfficerName],
    ["ID Number:", event.safetyOfficerIdNumber],
    ["Position:", event.safetyOfficerPosition || "Safety Officer"],
    ["Contact Number:", event.safetyOfficerContact],
    ["Email:", event.safetyOfficerEmail],
  ];
  const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
  const cellBorders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              borders: cellBorders,
              margins: { top: 60, bottom: 60, left: 100, right: 100 },
              children: [new Paragraph({ children: [run(label, { bold: true })] })],
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              borders: cellBorders,
              margins: { top: 60, bottom: 60, left: 100, right: 100 },
              children: [new Paragraph({ children: [run(value || "")] })],
            }),
          ],
        })
    ),
  });
}

export async function buildSafetyOfficerAppointmentLetter(event, images) {
  const body = [
    bodyPara(`Date:  ${event.datePrepared || event.eventDate || ""}`, { after: 100 }),
    new Paragraph({ spacing: { after: 100 }, children: [run("Event: ", { bold: true }), run(event.eventName || "", { bold: true })] }),
    bodyPara(`Venue: ${event.venue || event.venueAddress || ""}`, { after: 100 }),
    bodyPara(`Attention: ${event.jocAuthority || `${event.municipality || ""} – JOC Committee for Events`}`, { after: 220 }),

    bodyPara(
      "In accordance with the requirements of the Safety at Sports and Recreational Events Act, 2010 (Act No. 2 of 2010), this letter serves as the formal appointment of a Safety Officer for the event mentioned above."
    ),
    bodyPara("I, the undersigned, being the duly authorised representative of the Event Organiser, hereby appoint:", { after: 160 }),

    detailsTable(event),

    subheading("Duties and Responsibilities"),
    ...[
      "Oversee and implement all safety-related measures and protocols outlined in the Event Safety & Security Plan.",
      "Ensure compliance with the provisions of the SASREA Act, including risk categorisation, emergency planning, and safety structures.",
      "Liaise with the Event Safety and Security Planning Committee (ESSPC), relevant authorities, SAPS, emergency services, and event stakeholders.",
      "Conduct pre-event inspections, risk assessments, and ensure that appropriate safety measures are in place.",
      "Monitor and manage safety operations during the buildup, event, and breakdown phases.",
      "Report all incidents, hazards, or non-compliance to the Event Organiser and the ESSPC.",
      "Maintain a visible presence during the event and coordinate safety personnel effectively.",
      "Submit a post-event safety report with recommendations for future improvement.",
    ].map((text, i) => new Paragraph({ numbering: { reference: "appointment-letter-duties", level: 0 }, spacing: { after: 100 }, children: [run(text)] })),

    subheading("Acknowledgement of Acceptance"),
    bodyPara(
      "By signing this letter, the appointed Safety Officer accepts the role and responsibilities outlined above and undertakes to execute these duties with due diligence, professionalism, and in full compliance with the SASREA Act."
    ),
    bodyPara("For and on behalf of the Event Organiser", { after: 220 }),

    signatureLine("Name"),
    signatureLine("Designation"),
    signatureLine("Signature"),
    signatureLine("Date"),

    subheading("Acknowledgement by Safety Officer"),
    bodyPara(
      `I, the undersigned, accept my appointment as Safety Officer for the ${event.eventName || "event"} event and acknowledge my responsibilities as set out herein.`,
      { after: 220 }
    ),

    signatureLine("Name"),
    signatureLine("Signature"),
    signatureLine("Date"),
  ];

  return new Document({
    numbering: {
      config: [
        {
          reference: "appointment-letter-duties",
          levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 420, hanging: 260 } } } }],
        },
      ],
    },
    sections: [
      {
        properties: {},
        headers: { default: buildLetterHeader() },
        footers: { default: buildLetterFooter(images.masterLogo) },
        children: body,
      },
    ],
  });
}
