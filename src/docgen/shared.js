import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  PageNumber,
  ImageRun,
  ShadingType,
} from "docx";
import { IMPI } from "../data/companyInfo.js";

// ---- Colours (docx wants hex without #) ----
export const RED = "DE1819";
export const GOLD = "B8942E";
export const DARK = "231F20";
export const LIGHT_GREY = "F2F2F2";

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
export const NO_BORDERS = {
  top: noBorder,
  bottom: noBorder,
  left: noBorder,
  right: noBorder,
  insideHorizontal: noBorder,
  insideVertical: noBorder,
};

// Loads an image (File/Blob or fetch:able path) into an ArrayBuffer for docx ImageRun.
export async function loadImageBuffer(source) {
  if (!source) return null;
  if (source instanceof Blob) {
    return new Uint8Array(await source.arrayBuffer());
  }
  // Treat as a URL/path (e.g. /assets/impi-master-logo.png served from /public)
  const res = await fetch(source);
  if (!res.ok) return null;
  return new Uint8Array(await res.arrayBuffer());
}

export function titleRun(text, opts = {}) {
  return new TextRun({ text, bold: true, size: opts.size || 32, color: opts.color || DARK, font: "Calibri" });
}

export function bodyRun(text, opts = {}) {
  return new TextRun({ text, size: opts.size || 22, color: opts.color || DARK, font: "Calibri", bold: !!opts.bold });
}

// ---- Cover page: master logo (left) + event logo (right), title block ----
// Modern corporate layout: large logos, bold full-colour title band, dark/gold
// detail block instead of a plain grey box.
export async function buildCoverPage({ docTitle, subTitle, eventLogoBuffer, masterLogoBuffer, event, extraDetailRows = [] }) {
  const children = [];

  // Logo row — larger, generous whitespace, master logo left / event logo right
  const logoCells = [];
  logoCells.push(
    new TableCell({
      width: { size: 55, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      verticalAlign: "center",
      children: [
        masterLogoBuffer
          ? new Paragraph({
              children: [new ImageRun({ data: masterLogoBuffer, transformation: { width: 300, height: 152 } })],
            })
          : new Paragraph({ children: [bodyRun("IMPI RMS (Pty) Ltd", { bold: true, size: 28 })] }),
      ],
    })
  );
  logoCells.push(
    new TableCell({
      width: { size: 45, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      verticalAlign: "center",
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            eventLogoBuffer
              ? new ImageRun({ data: eventLogoBuffer, transformation: { width: 210, height: 130 } })
              : bodyRun(""),
          ],
        }),
      ],
    })
  );
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      rows: [new TableRow({ children: logoCells })],
    })
  );

  children.push(new Paragraph({ text: "", spacing: { after: 400 } }));

  // Title band — solid red fill, white bold title, gold subtitle. Modern
  // corporate cover treatment instead of a plain grey strip.
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: RED },
              borders: NO_BORDERS,
              margins: { top: 260, bottom: 260, left: 280, right: 280 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: docTitle, bold: true, size: 40, color: "FFFFFF", font: "Calibri" })],
                }),
                subTitle
                  ? new Paragraph({
                      spacing: { before: 60 },
                      children: [new TextRun({ text: subTitle, bold: true, size: 22, color: "FDDB07", font: "Calibri" })],
                    })
                  : new Paragraph({ text: "" }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(new Paragraph({ text: "", spacing: { after: 260 } }));
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [titleRun(event.eventName || "Event Name", { size: 44 })],
    })
  );
  children.push(new Paragraph({ spacing: { after: 260 }, children: [bodyRun(event.venueAddress || event.venue || "", { size: 22 })] }));

  // Detail block — dark label column with gold text, clean corporate table
  const detailRows = [
    ["Event Date", event.eventDate],
    ["Operating Times", event.operatingTimes],
    ["Expected Attendance", `${event.expectedAttendance || ""} PAX`],
    ["Risk Category", event.riskCategory],
    ["Municipality", event.municipality],
    ...extraDetailRows,
    ["Prepared By", "IMPI Risk Management Services"],
    ["Event Safety Officer", event.eventSafetyOfficer],
    ["Date Prepared", event.datePrepared],
    ["Version", "1.0"],
  ];
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      rows: detailRows.map(
        ([label, value]) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 32, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.CLEAR, fill: DARK },
                margins: { top: 80, bottom: 80, left: 160, right: 120 },
                borders: NO_BORDERS,
                children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, color: "FDDB07", font: "Calibri" })] })],
              }),
              new TableCell({
                width: { size: 68, type: WidthType.PERCENTAGE },
                margins: { top: 80, bottom: 80, left: 160, right: 120 },
                borders: NO_BORDERS,
                children: [new Paragraph({ children: [bodyRun(value || "", { size: 22 })] })],
              }),
            ],
          })
      ),
    })
  );

  return children;
}

// ---- Document Control table (identical shape across all IMPI plan docs) ----
export function buildDocumentControlTable(event, extraRows = []) {
  const rows = [
    ["Event Name:", event.eventName],
    ["Venue:", event.venue],
    ["Municipality:", event.municipality],
    ["Event Date(s):", event.eventDate],
    ["Expected Attendance:", `${event.expectedAttendance || ""} PAX`],
    ["Risk Category:", event.riskCategory],
    ["Client / Organiser:", event.clientName],
    ...extraRows,
    ["Version:", "1.0"],
    ["Prepared by:", event.preparedBy || "Shane Steynfaardt"],
    ["Date:", event.datePrepared],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: DARK },
              margins: { top: 80, bottom: 80, left: 140, right: 100 },
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, color: "FDDB07", font: "Calibri" })] })],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 140, right: 100 },
              children: [new Paragraph({ children: [bodyRun(value || "")] })],
            }),
          ],
        })
    ),
  });
}

export function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: RED, space: 8 } },
    indent: { left: 20 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, font: "Calibri", size: 26 })],
  });
}

export function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, color: GOLD, font: "Calibri", size: 23 })],
  });
}

export function paragraph(text) {
  return new Paragraph({ spacing: { after: 120 }, children: [bodyRun(text)] });
}

export function bullet(text) {
  return new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: [bodyRun(text)] });
}

// ---- Footer: IMPI contact block on every page ----
export function buildFooter(brand = IMPI) {
  return new Footer({
    children: [
      new Paragraph({
        border: {
          top: { style: BorderStyle.SINGLE, size: 4, color: RED, space: 4 },
        },
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 0 },
        children: [
          new TextRun({ text: "HONESTY, INTEGRITY, LOYALTY", size: 14, color: GOLD, bold: true, font: "Calibri", italics: true }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: `${brand.legalName} t/a ${brand.tradingAs}  |  ${brand.address}  |  ${brand.phone}  |  ${brand.email}  |  ${brand.website}  |  PSIRA No: ${brand.psiraNo}`,
            size: 15,
            color: DARK,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], size: 15, color: DARK, font: "Calibri" }),
        ],
      }),
    ],
  });
}

export function buildHeader(docLabel) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: docLabel, size: 16, color: GOLD, font: "Calibri", bold: true })],
      }),
    ],
  });
}

export function complianceDeclaration(text, signOffLines) {
  const nodes = [heading1("Final Compliance Declaration"), paragraph(text)];
  for (const label of signOffLines) {
    nodes.push(
      new Paragraph({ spacing: { before: 200 }, children: [bodyRun(`${label}:`, { bold: true }), bodyRun("\t___________________________")] }),
      new Paragraph({ spacing: { after: 120 }, children: [bodyRun("Date:", { bold: true }), bodyRun("\t___________________________")] })
    );
  }
  return nodes;
}

// ---- Embeds a reference image (signage / diagram) with a caption, centred. ----
export function sectionImage(buffer, { width, height, caption } = {}) {
  if (!buffer) return [];
  const nodes = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: caption ? 40 : 160 },
      children: [new ImageRun({ data: buffer, transformation: { width: width || 260, height: height || 260 } })],
    }),
  ];
  if (caption) {
    nodes.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: caption, italics: true, size: 18, color: DARK, font: "Calibri" })],
      })
    );
  }
  return nodes;
}
