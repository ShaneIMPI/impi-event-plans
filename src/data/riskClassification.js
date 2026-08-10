// SASREA-style Event Risk Classification checklist (Section 5 of the Event
// Risk Assessment). 67 items across 4 categories. Each item is scored by the
// user as N/A (0), Low (1), Medium (2), or High (3). Category totals are
// summed into an overall Total Risk Rating, which is banded per SASREA
// guidance to determine the required level of safety governance.
//
// Banding (per IMPI master template):
//   1-25   = LOW RISK (Safety Officer)
//   26-50  = LOW RISK (Event Safety Committee)
//   51-75  = MEDIUM RISK (Fully Representative VOC)
//   76+    = HIGH RISK (Implement risk reduction efforts)

export const SCORE_OPTIONS = [
  { value: 0, label: "N/A" },
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

export const CLASSIFICATION_CATEGORIES = [
  {
    id: "activity",
    title: "5.1 Activity Risk Category",
    items: [
      "Festival / Theatre: Classical (Low)",
      "Festival / Concert: Pop/Rock (Medium)",
      "Festival / Concert: Rave/Disco (High)",
      "Political: Disorder – Low",
      "Political: Disorder – Medium",
      "Political: Disorder – High",
      "Religious: Same Faith – Low",
      "Religious: Interfaith – Medium",
      "Religious: Opposing – High",
      "Sport: Disorder – Low",
      "Sport: Disorder – Medium",
      "Sport: Disorder – High",
      "Funeral: Disorder – Low",
      "Funeral: Disorder – Medium",
      "Funeral: Disorder – High",
      "Educational / Recreational",
      "Exhibition",
      "Promotional / Recreational",
      "Carnival / Fair: Variety",
    ],
  },
  {
    id: "audience",
    title: "5.2 Audience Risk Category",
    items: [
      "Smaller than 2,000 attendees",
      "2,000 to 15,000 attendees",
      "Larger than 15,000 attendees",
      "Participant profile",
      "Expected crowd behaviour",
      "Special needs",
    ],
  },
  {
    id: "venue",
    title: "5.3 Venue / Site Design Risk Category",
    items: [
      "Suitable for expected attendance",
      "Indoor",
      "Outdoor",
      "Enclosed",
      "Unfenced",
      "Absence of seating",
      "General condition of facility",
      "Geographical location",
      "Design: surface, exits, access control",
      "Suitable for special needs attendance",
      "Marquees or tents erected",
      "Compliance of venue: Fire, OHS Act, Building Regulations",
      "Transportation arrangements",
      "Parking arrangements",
      "Emergency vehicle accessibility",
      "Suitable public emergency evacuation",
      "Availability of services",
      "Back-up generator / UPS systems",
      "Provision for medical centre / station",
      "Temporary structures",
    ],
  },
  {
    id: "other",
    title: "5.4 Other Threats and Impacts",
    items: [
      "Fire",
      "Time of day and duration",
      "Terrorism and gangsterism",
      "Power failures",
      "Crowd surge / crowd disorder",
      "Adverse weather conditions",
      "Off-site events (industrial action, strikes)",
      "Medical emergencies",
      "Ticketing (demand, counterfeit, ability)",
      "Traffic / transport disruptions",
      "Temporary structure failure",
      "Loss of water supply or sanitation",
      "Food hygiene",
      "Alcohol sales and substance abuse",
      "Pyrotechnics",
      "Provision for cancellation or postponement",
      "Turnstile and PA failure",
      "Pollution: noise",
      "Pollution: litter / air",
      "Other environmental impacts",
      "Insufficient planning done for event",
      "Limited emergency service planning done",
    ],
  },
];

export function totalClassificationItems() {
  return CLASSIFICATION_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0); // 67
}

// answers: { [categoryId]: { [itemIndex]: 0|1|2|3 } }
export function computeRiskClassification(answers = {}) {
  const categoryResults = CLASSIFICATION_CATEGORIES.map((cat) => {
    const catAnswers = answers[cat.id] || {};
    const scored = cat.items.map((_, idx) => catAnswers[idx] ?? 0);
    const total = scored.reduce((s, v) => s + v, 0);
    const answeredCount = scored.filter((v) => v > 0).length;
    const average = answeredCount ? total / answeredCount : 0;
    return { id: cat.id, title: cat.title, total, average, itemCount: cat.items.length };
  });

  const total = categoryResults.reduce((sum, c) => sum + c.total, 0);
  const band = bandFromTotal(total);

  return { categoryResults, total, band };
}

export function bandFromTotal(total) {
  if (total <= 25) return { label: "LOW RISK", sub: "Safety Officer", color: "8BC34A" };
  if (total <= 50) return { label: "LOW RISK", sub: "Event Safety Committee", color: "8BC34A" };
  if (total <= 75) return { label: "MEDIUM RISK", sub: "Fully Representative VOC", color: "FDDB07" };
  return { label: "HIGH RISK", sub: "Implement Risk Reduction Efforts", color: "DE1819" };
}
