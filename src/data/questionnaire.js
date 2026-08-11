// Questionnaire schema.
// Each field has: id, label, type, group, modules (which toggled modules need it),
// and optional options (for select), placeholder, required.
//
// The UI renders each field ONCE even if multiple toggled modules request it —
// this is what gives Shane the "answer once, populate both documents" behaviour.

export const RISK_CATEGORIES = ["Low Risk", "Medium Risk", "High Risk"];

export const CORE_FIELDS = [
  { id: "eventName", label: "Event Name", type: "text", required: true },
  { id: "clientName", label: "Client / Organiser Name", type: "text", required: true },
  { id: "venue", label: "Venue Name", type: "text", required: true },
  { id: "venueAddress", label: "Venue Address", type: "text", required: true },
  { id: "municipality", label: "Municipality", type: "text", required: true },
  { id: "eventDate", label: "Event Date(s)", type: "text", placeholder: "e.g. 29 August 2026", required: true },
  { id: "operatingTimes", label: "Operating Times", type: "text", placeholder: "e.g. 10:00 – 17:00" },
  { id: "expectedAttendance", label: "Expected Attendance (PAX)", type: "number", required: true },
  { id: "riskCategory", label: "Risk Category", type: "select", options: RISK_CATEGORIES, required: true },
  { id: "eventLogo", label: "Event Logo (optional)", type: "image" },
  { id: "natureOfEvent", label: "Nature of the Event (short description)", type: "textarea", required: true },
  { id: "eventSafetyOfficer", label: "Event Safety Officer (name)", type: "text", required: true },
  { id: "preparedBy", label: "Document Prepared By", type: "text", default: "Shane Steynfaardt" },
  { id: "datePrepared", label: "Date Prepared", type: "text" },
];

// Shared operational fields — asked once, used by both Safety and Security docs
// when either (or both) are toggled on.
export const SHARED_OPERATIONAL_FIELDS = [
  {
    id: "medicalProvider",
    label: "Medical / EMS Service Provider",
    type: "text",
    modules: ["safety", "security"],
  },
  {
    id: "sapsLiaisonContact",
    label: "SAPS Liaison Contact (name/station, if known)",
    type: "text",
    modules: ["safety", "security"],
  },
  {
    id: "jocAuthority",
    label: "JOC / Municipal Authority Department",
    type: "text",
    modules: ["safety", "security", "evacuation", "appointmentLetter"],
    placeholder: "e.g. City of Tshwane – JOC Committee for Events",
  },
  {
    id: "assemblyPoints",
    label: "Assembly Point(s) Location",
    type: "textarea",
    modules: ["safety", "security", "evacuation"],
  },
  {
    id: "commandControlLocation",
    label: "Command & Control Point Location",
    type: "text",
    modules: ["safety", "security", "evacuation"],
  },
];

export const EVACUATION_FIELDS = [
  { id: "emergencyExits", label: "Emergency Exits / Routes (one per line)", type: "textarea", modules: ["evacuation"], placeholder: "e.g. Main Gate — 4m wide, unobstructed\nEast Gate — 3m wide, unobstructed" },
  { id: "evacuationMarshalsCount", label: "Number of Evacuation Marshals", type: "number", modules: ["evacuation", "safety"] },
  { id: "specialNeedsProvisions", label: "Special Needs / Wheelchair Evacuation Provisions", type: "textarea", modules: ["evacuation"] },
  { id: "evacuationTriggers", label: "Evacuation Triggers (one per line)", type: "textarea", modules: ["evacuation"], placeholder: "e.g. Fire / smoke detected\nStructural instability\nBomb threat\nSAPS/Disaster Management instruction" },
  { id: "allClearAuthority", label: "Who May Declare All-Clear", type: "text", modules: ["evacuation"], default: "Event Safety Officer, in consultation with SAPS/Fire Services" },
];

export const APPOINTMENT_LETTER_FIELDS = [
  { id: "safetyOfficerName", label: "Safety Officer — Full Name", type: "text", modules: ["appointmentLetter"], placeholder: "e.g. Annette Van Vuuren" },
  { id: "safetyOfficerIdNumber", label: "Safety Officer — ID Number", type: "text", modules: ["appointmentLetter"] },
  { id: "safetyOfficerPosition", label: "Safety Officer — Position / Grading", type: "text", modules: ["appointmentLetter"], default: "Safety Officer" },
  { id: "safetyOfficerContact", label: "Safety Officer — Contact Number", type: "text", modules: ["appointmentLetter"] },
  { id: "safetyOfficerEmail", label: "Safety Officer — Email Address", type: "text", modules: ["appointmentLetter"] },
];

export const SAFETY_FIELDS = [
  { id: "medicalCoordinatorName", label: "Medical Coordinator (name)", type: "text", modules: ["safety"] },
  { id: "fireWardensCount", label: "Number of Fire Wardens", type: "number", modules: ["safety"] },
  {
    id: "hazardsPresent",
    label: "Hazards Present at This Event",
    type: "multiselect",
    modules: ["safety"],
    options: [
      "Slips, trips and falls",
      "Electrical hazards",
      "Temporary structures",
      "Congestion points",
      "Fire hazards",
      "Working at height",
      "Vehicle movement",
      "Weather exposure",
    ],
  },
  { id: "trainingDate", label: "Safety Induction / Training Date", type: "text", modules: ["safety"] },
];

export const SECURITY_FIELDS = [
  { id: "psiraRegNumber", label: "PSIRA Registration Number", type: "text", modules: ["security"], default: "2689596" },
  { id: "totalSecurityPersonnel", label: "Total Security Personnel Deployed", type: "number", modules: ["security"] },
  { id: "supervisorsCount", label: "Number of Supervisors (Grade B)", type: "number", modules: ["security"] },
  { id: "securityOfficersCount", label: "Number of Security Officers (Grade C)", type: "number", modules: ["security"] },
  { id: "accessControlPoints", label: "Access Control Points", type: "textarea", modules: ["security"] },
  { id: "noGoZones", label: "No-Go / Restricted Zones", type: "textarea", modules: ["security"] },
  {
    id: "alcoholOnSite",
    label: "Is alcohol served/sold on site?",
    type: "select",
    options: ["Yes", "No"],
    modules: ["security"],
  },
];

export const PARKING_FIELDS = [
  {
    id: "parkingZonesDescription",
    label: "Parking Zones (describe each zone / location)",
    type: "textarea",
    modules: ["parking"],
    placeholder: "e.g. General Parking – top field area; Overflow – adjacent, activated at 80%; Staff – bottom-left, controlled access; Artist/Disabled – triangle patch above staff parking",
  },
  { id: "ingressPoint", label: "Main Ingress / Access Point", type: "text", modules: ["parking"], placeholder: "e.g. M5 main access point" },
  { id: "pedestrianWalkway", label: "Pedestrian Walkway Route", type: "text", modules: ["parking"] },
  { id: "overflowTrigger", label: "Overflow Activation Trigger", type: "text", modules: ["parking"], default: "±80% primary capacity" },
  { id: "parkingMarshalsCount", label: "Number of Parking Marshals", type: "number", modules: ["parking"] },
  { id: "entryExitOfficersCount", label: "Number of Entry/Exit Officers", type: "number", modules: ["parking"] },
  { id: "rovingOfficersCount", label: "Number of Roving Reaction Officers", type: "number", modules: ["parking"] },
  { id: "deploymentPositions", label: "Deployment Positions (one per line)", type: "textarea", modules: ["parking"] },
  { id: "trafficDepartment", label: "Municipal Traffic Department", type: "text", modules: ["parking"], placeholder: "e.g. Mogale Traffic Department" },
];

export const TRAFFIC_FIELDS = [
  { id: "affectedRoads", label: "Roads / Intersections Affected", type: "textarea", modules: ["traffic"], placeholder: "List each road or intersection impacted by the event" },
  { id: "roadClosures", label: "Road Closures (road, date, time window)", type: "textarea", modules: ["traffic"] },
  { id: "detourRoutes", label: "Detour Routes", type: "textarea", modules: ["traffic"] },
  { id: "trafficOfficersCount", label: "Number of Traffic Officers (SAPS/Metro)", type: "number", modules: ["traffic"] },
  { id: "trafficMarshalsCount", label: "Number of Traffic Marshals (IMPI)", type: "number", modules: ["traffic"] },
  { id: "noticePeriod", label: "Public Notice Period / Method", type: "text", modules: ["traffic"], placeholder: "e.g. 14 days prior via municipal gazette and on-site signage" },
  { id: "emergencyAccessRoutes", label: "Emergency Vehicle Access Routes Maintained", type: "textarea", modules: ["traffic"] },
  { id: "trafficDepartment", label: "Municipal Traffic Department", type: "text", modules: ["traffic"], placeholder: "e.g. Tshwane Metro Police Department" },
];

export const RISK_ASSESSMENT_EVENT_TYPES = ["Marathon", "Sports", "Exhibition/Festival"];

export const RISK_ASSESSMENT_FIELDS = [
  {
    id: "raEventType",
    label: "Event Type (determines which hazards apply)",
    type: "select",
    options: RISK_ASSESSMENT_EVENT_TYPES,
    modules: ["riskAssessment"],
    required: true,
  },
  { id: "riskAssessor", label: "Risk Assessor", type: "text", modules: ["riskAssessment"], default: "IMPI Risk Management Services" },
];

// Returns the deduplicated, ordered field list for the currently toggled modules.
export function buildQuestionnaire(toggledModules) {
  const fields = [...CORE_FIELDS];
  const seen = new Set(fields.map((f) => f.id));

  const addIfRelevant = (fieldList) => {
    for (const f of fieldList) {
      if (seen.has(f.id)) continue;
      if (!f.modules || f.modules.some((m) => toggledModules.includes(m))) {
        fields.push(f);
        seen.add(f.id);
      }
    }
  };

  addIfRelevant(SHARED_OPERATIONAL_FIELDS);
  if (toggledModules.includes("safety")) addIfRelevant(SAFETY_FIELDS);
  if (toggledModules.includes("security")) addIfRelevant(SECURITY_FIELDS);
  if (toggledModules.includes("parking")) addIfRelevant(PARKING_FIELDS);
  if (toggledModules.includes("traffic")) addIfRelevant(TRAFFIC_FIELDS);
  if (toggledModules.includes("evacuation")) addIfRelevant(EVACUATION_FIELDS);
  if (toggledModules.includes("appointmentLetter")) addIfRelevant(APPOINTMENT_LETTER_FIELDS);
  if (toggledModules.includes("riskAssessment")) addIfRelevant(RISK_ASSESSMENT_FIELDS);

  return fields;
}
