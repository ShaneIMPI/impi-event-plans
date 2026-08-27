// Generates a simple cursive signature image on the fly, for anyone whose
// real signature isn't in SIGNATURE_LIBRARY yet. This is a font-based
// approximation (Mrs Saint Delafield, slight slant, a light tail flourish) —
// it reads as "a signature," but a real signature added to the library will
// always look better. Runs entirely client-side via Canvas; no network
// dependency beyond the bundled font.
import "@fontsource/mrs-saint-delafield";

const FONT_FAMILY = "Mrs Saint Delafield";

async function ensureFontLoaded(sizePx) {
  if (typeof document === "undefined" || !document.fonts) return;
  await document.fonts.load(`${sizePx}px "${FONT_FAMILY}"`);
  await document.fonts.ready;
}

export async function generateSignatureDataUrl(name, opts = {}) {
  const fontSizePx = opts.fontSizePx || 70;
  const color = opts.color || "#14141a";
  const slantDeg = opts.slantDeg ?? -4;
  const scale = opts.scale || 3; // render at higher resolution for a crisp embed

  await ensureFontLoaded(fontSizePx);

  // First pass on a scratch canvas purely to measure the text
  const measureCanvas = document.createElement("canvas");
  const mctx = measureCanvas.getContext("2d");
  mctx.font = `${fontSizePx}px "${FONT_FAMILY}"`;
  const metrics = mctx.measureText(name);
  const textWidth = metrics.width;
  const ascent = metrics.actualBoundingBoxAscent || fontSizePx * 0.8;
  const descent = metrics.actualBoundingBoxDescent || fontSizePx * 0.35;

  const padX = fontSizePx * 0.6;
  const padY = fontSizePx * 0.7;
  const tailW = fontSizePx * 1.6;
  const cw = textWidth + padX * 2 + tailW;
  const ch = ascent + descent + padY * 2;

  const canvas = document.createElement("canvas");
  canvas.width = cw * scale;
  canvas.height = ch * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.textBaseline = "alphabetic";
  ctx.font = `${fontSizePx}px "${FONT_FAMILY}"`;

  const baseX = padX;
  const baseY = padY + ascent;

  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.rotate((slantDeg * Math.PI) / 180);
  ctx.fillText(name, 0, 0);

  // Light tail flourish trailing off the last letter
  ctx.beginPath();
  const tailStartX = textWidth - 6;
  ctx.moveTo(tailStartX, -fontSizePx * 0.12);
  ctx.quadraticCurveTo(
    tailStartX + tailW * 0.55,
    -fontSizePx * 0.32,
    tailStartX + tailW * 0.95,
    -fontSizePx * 0.08
  );
  ctx.lineWidth = Math.max(1, fontSizePx * 0.025);
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();

  return canvas.toDataURL("image/png");
}
