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
  VerticalAlign,
} from "docx";
import { IMPI } from "../data/companyInfo.js";

// ---- Colours (docx wants hex without #) ----
export const RED = "DE1819";
export const GOLD = "B8942E";
export const DARK = "231F20";
export const GREY = "595959";
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
  try {
    if (source instanceof Blob) {
      return new Uint8Array(await source.arrayBuffer());
    }
    if (typeof source === "string" && source.startsWith("data:")) {
      // Base64 data URL (e.g. a user-uploaded event logo, stored this way
      // specifically so it can round-trip through IndexedDB safely — see
      // FieldInput.jsx for why raw File objects are avoided here).
      const base64 = source.slice(source.indexOf(",") + 1);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }
    // Treat as a URL/path (e.g. /assets/impi-master-logo.png served from /public)
    const res = await fetch(source);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch (err) {
    // Never let a bad/unreadable image block the whole document from
    // generating — fall back to no logo rather than throwing.
    console.warn("loadImageBuffer: failed to load image, continuing without it", err);
    return null;
  }
}

export function titleRun(text, opts = {}) {
  return new TextRun({ text, bold: true, size: opts.size || 32, color: opts.color || DARK, font: "Calibri" });
}

export function bodyRun(text, opts = {}) {
  return new TextRun({ text, size: opts.size || 22, color: opts.color || DARK, font: "Calibri", bold: !!opts.bold });
}

// ---- Cover page: centred master logo, centred title/subtitle, red rule,
// plain document-detail table. Matches the approved IMPI master templates. ----
export async function buildCoverPage({ docTitle, subTitle, eventLogoBuffer, masterLogoBuffer, event, extraDetailRows = [] }) {
  const children = [];

  // Logo — centred, generous size
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 320 },
      children: [
        masterLogoBuffer
          ? new ImageRun({ data: masterLogoBuffer, transformation: { width: 400, height: 203 } })
          : new TextRun({ text: "IMPI RMS (Pty) Ltd", bold: true, size: 28, color: DARK, font: "Calibri" }),
      ],
    })
  );

  // Event logo, if supplied — centred, smaller, beneath the master logo
  if (eventLogoBuffer) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 320 },
        children: [new ImageRun({ data: eventLogoBuffer, transformation: { width: 220, height: 136 } })],
      })
    );
  }

  // Document title — centred, bold black
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: docTitle, bold: true, size: 32, color: DARK, font: "Calibri" })],
    })
  );
  if (subTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: subTitle, bold: true, size: 22, color: GREY, font: "Calibri" })],
      })
    );
  }

  // Event name / venue — centred
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: event.eventName || "Event Name", bold: true, size: 30, color: DARK, font: "Calibri" })],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 8 } },
      children: [new TextRun({ text: event.venueAddress || event.venue || "", size: 22, color: GREY, font: "Calibri" })],
    })
  );
  children.push(new Paragraph({ text: "", spacing: { after: 260 } }));

  // Plain detail table — bold black label, plain value, no shading
  const detailRows = [
    ["Event Date:", event.eventDate],
    ["Operating Times:", event.operatingTimes],
    ["Expected Attendance:", `${event.expectedAttendance || ""} PAX`],
    ["Risk Category:", event.riskCategory],
    ["Municipality:", event.municipality],
    ...extraDetailRows,
    ["Prepared By:", "IMPI Risk Management Services"],
    ["Event Safety Officer:", event.eventSafetyOfficer],
    ["Date Prepared:", event.datePrepared],
    ["Version:", "1.0"],
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
                margins: { top: 60, bottom: 60, left: 0, right: 120 },
                borders: NO_BORDERS,
                children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22, color: DARK, font: "Calibri" })] })],
              }),
              new TableCell({
                width: { size: 68, type: WidthType.PERCENTAGE },
                margins: { top: 60, bottom: 60, left: 0, right: 0 },
                borders: NO_BORDERS,
                children: [new Paragraph({ children: [bodyRun(value || "", { size: 22, color: GREY })] })],
              }),
            ],
          })
      ),
    })
  );

  return children;
}

// ---- Document Control table (identical shape across all IMPI plan docs) ----
// Plain white table, bold black labels, plain values — no shading.
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
    borders: NO_BORDERS,
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              margins: { top: 60, bottom: 60, left: 0, right: 100 },
              borders: NO_BORDERS,
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22, color: DARK, font: "Calibri" })] })],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 60, bottom: 60, left: 0, right: 0 },
              borders: NO_BORDERS,
              children: [new Paragraph({ children: [bodyRun(value || "", { color: GREY })] })],
            }),
          ],
        })
    ),
  });
}

// ---- Section heading: bold black text with a full-width red underline rule ----
export function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 40 },
    keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 6 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, font: "Calibri", size: 26 })],
  });
}

// ---- Subheading: bold black text with a short, thin gold accent bar to the left ----
export function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    keepNext: true,
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: GOLD, space: 6 } },
    indent: { left: 10 },
    children: [new TextRun({ text, bold: true, color: DARK, font: "Calibri", size: 22 })],
  });
}

export function paragraph(text) {
  return new Paragraph({ spacing: { after: 120 }, children: [bodyRun(text)] });
}

export function bullet(text) {
  return new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: [bodyRun(text)] });
}

// ---- Footer: Event/Venue | Municipality/Risk | Page X of Y, then company
// contact line, then italic confidentiality notice. Matches the master. ----
export function buildFooter(event = {}, brand = IMPI) {
  const cellStyle = { size: 22, color: GREY, font: "Calibri" };

  const infoRow = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({ children: [new TextRun({ text: `Event: ${event.eventName || ""}`, ...cellStyle })] }),
              new Paragraph({ children: [new TextRun({ text: `Venue: ${event.venue || event.venueAddress || ""}`, ...cellStyle })] }),
            ],
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({ children: [new TextRun({ text: `Municipality: ${event.municipality || ""}`, ...cellStyle })] }),
              new Paragraph({ children: [new TextRun({ text: `Risk Category: ${event.riskCategory || ""}`, ...cellStyle })] }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "Page ", ...cellStyle }),
                  new TextRun({ children: [PageNumber.CURRENT], ...cellStyle }),
                  new TextRun({ text: " of ", ...cellStyle }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], ...cellStyle }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: RED, space: 4 } },
        spacing: { before: 100, after: 0 },
        children: [],
      }),
      infoRow,
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 0 },
        children: [
          new TextRun({
            text: `${brand.legalName}  |  ${brand.address}  |  ${brand.phone}  |  ${brand.email}  |  PSIRA Registration ${brand.psiraNo}`,
            size: 15,
            color: DARK,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40 },
        children: [
          new TextRun({
            text: "This document is confidential and prepared exclusively for the named event and JOC/ESSPC submission. Unauthorised distribution is prohibited.",
            size: 14,
            italics: true,
            color: GREY,
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

// ---- Header: small logo left, bold black document title right (wraps) ----
export function buildHeader(docTitle, subTitle, masterLogoBuffer) {
  const titleRuns = [new TextRun({ text: docTitle, bold: true, size: 24, color: DARK, font: "Calibri" })];
  if (subTitle) {
    titleRuns.push(new TextRun({ text: ` ${subTitle}`, bold: true, size: 24, color: DARK, font: "Calibri", break: 0 }));
  }

  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                borders: NO_BORDERS,
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    children: masterLogoBuffer
                      ? [new ImageRun({ data: masterLogoBuffer, transformation: { width: 140, height: 71 } })]
                      : [new TextRun({ text: "IMPI RMS (Pty) Ltd", bold: true, size: 18, color: DARK, font: "Calibri" })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 65, type: WidthType.PERCENTAGE },
                borders: NO_BORDERS,
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: titleRuns })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ---- Blank header/footer for the cover/title page (docx titlePage mode) ----
export function emptyHeader() {
  return new Header({ children: [] });
}
export function emptyFooter() {
  return new Footer({ children: [] });
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
