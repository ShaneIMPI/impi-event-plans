// Library of real, pre-made signature images for people who sign IMPI
// documents regularly. When a document needs to embed someone's signature
// (e.g. the Event Safety Officer, Risk Assessor, Security Manager sign-off
// blocks, or the Safety Officer Appointment Letter), the name typed into the
// relevant field is looked up here first. If it's not in the library, a
// signature is generated on the fly instead (see signatureGen.js) — so new
// people still get *something*, but anyone added here gets their real
// signature, which will always look better than a generated one.
//
// Each entry also carries a `designation` — when a name matches, that title
// auto-fills anywhere a document asks for the signer's designation (e.g. the
// Appointment Letter's "Designation:" line), alongside the signature itself.
//
// To add someone new: get a clean image of their signature (cropped tightly,
// transparent or white background), save it as
// public/assets/signatures/sig_<slug>.png, and add an entry below with their
// name exactly as it's typically typed into the questionnaire.
//
// NOTE on designations: Steven Bruce and Annette Van Vuuren are left blank
// intentionally — both only ever sign as the appointed Safety Officer (a
// junior appointee role), never as the person doing the appointing, so no
// separate management designation applies to them. Eldon de Jager has been
// removed entirely — he's an engineer only and doesn't sign safety/security
// documents at all.
export const SIGNATURE_LIBRARY = {
  "shane steynfaardt": { file: "sig_shane-steynfaardt.png", designation: "Senior Operations Manager" },
  "jacques van vuuren": { file: "sig_jacques-van-vuuren.png", designation: "HOD: Events & Operations" },
  "annette van vuuren": { file: "sig_annette-van-vuuren.png", designation: "" },
  "steven bruce": { file: "sig_steven-bruce.png", designation: "" },
  "leon smit": { file: "sig_leon-smit.png", designation: "" },
  "jaco van dyk": { file: "sig_jaco-van-dyk.png", designation: "Managing Director" },
};

export function normalizeName(name) {
  return (name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// Returns the asset filename if this person has a real signature on file,
// or null if we don't have one (caller should fall back to generation).
export function lookupSignatureAsset(name) {
  const entry = SIGNATURE_LIBRARY[normalizeName(name)];
  return entry ? entry.file : null;
}

// Returns their stored designation/title, or "" if unknown.
export function lookupDesignation(name) {
  const entry = SIGNATURE_LIBRARY[normalizeName(name)];
  return entry?.designation || "";
}
