// Library of real, pre-made signature images for people who sign IMPI
// documents regularly. When a document needs to embed someone's signature
// (e.g. the Event Safety Officer, Risk Assessor, Security Manager sign-off
// blocks, or the Safety Officer Appointment Letter), the name typed into the
// relevant field is looked up here first. If it's not in the library, a
// signature is generated on the fly instead (see signatureGen.js) — so new
// people still get *something*, but anyone added here gets their real
// signature, which will always look better than a generated one.
//
// To add someone new: get a clean image of their signature (cropped tightly,
// transparent or white background), save it as
// public/assets/signatures/sig_<slug>.png, and add an entry below with their
// name exactly as it's typically typed into the questionnaire.
export const SIGNATURE_LIBRARY = {
  "shane steynfaardt": "sig_shane-steynfaardt.png",
  "jacques van vuuren": "sig_jacques-van-vuuren.png",
  "annette van vuuren": "sig_annette-van-vuuren.png",
  "steven bruce": "sig_steven-bruce.png",
  "leon smit": "sig_leon-smit.png",
  "jaco van dyk": "sig_jaco-van-dyk.png",
  "eldon de jager": "sig_eldon-de-jager.png",
};

export function normalizeName(name) {
  return (name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// Returns the asset filename if this person has a real signature on file,
// or null if we don't have one (caller should fall back to generation).
export function lookupSignatureAsset(name) {
  const key = normalizeName(name);
  return SIGNATURE_LIBRARY[key] || null;
}
