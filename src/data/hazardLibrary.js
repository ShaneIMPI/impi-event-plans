// Full IMPI hazard library — consolidated from the Marathon, Sports, Exhibition
// and Festival risk assessment masters into a single tagged library.
// Each hazard is tagged with the event type(s) it applies to. When generating
// a Risk Assessment for a given `eventType`, only rows tagged for that type
// are included in Section 7 of the document.
//
// A: Injury Severity, B: Frequency of Occurrence, C: Potential Damage/Loss,
// D: Environmental Impact. R is the assessor-determined Risk Value for that
// hazard (per the approved IMPI master template — reproduced literally here,
// not recalculated, to match the reviewed/approved source document exactly).
// Banding: LOW 0-6, MEDIUM 6-16, HIGH 16-32, CRITICAL 32-40.

export const EVENT_TYPES = ["MARATHON", "SPORTS", "EXHIBITION/FESTIVAL"];

function h(hazard, cause, result, a, b, c, d, r, prevent, control, tags) {
  return { hazard, cause, result, a, b, c, d, r, prevent, control, tags };
}

export const HAZARD_LIBRARY = [
  // A. Crowd Management
  { category: "A. Crowd Management", rows: [
    h("Spectator Overcrowding", "High-density finish chute / start pen", "Crushing, falls, panic", 4, 3, 2, 1, 10, "Capacity management; phased start waves; fenced zones", "Ushers, signage, restricted access to start/finish chute", ["MARATHON"]),
    h("Spectator Movement", "Congestion at road crossings & finish area", "Slips, collisions, minor injuries", 2, 3, 1, 1, 7, "Marked spectator walkways; designated crossing points", "Marshals at crossings; PA announcements", ["MARATHON"]),
    h("Intoxicated Spectators", "Alcohol in social / finish zones", "Fights, disorder, injury", 3, 3, 2, 1, 9, "Alcohol policy; licensed trade zones only", "Security patrols; removal protocol", ["MARATHON"]),
    h("Spectator Encroachment onto Course", "Spectators stepping onto live road", "Runner collision; spectator injury", 4, 2, 2, 1, 9, "Crowd barriers along course; marshal briefing on crowd control", "Security presence at pinch points; marshals empowered to push crowd back", ["MARATHON"]),
    h("Spectator Overcrowding", "High-density spectator stands", "Crushing, falls, panic", 4, 3, 2, 1, 10, "Capacity management, controlled seating", "Ushers, signage, restricted access", ["SPORTS"]),
    h("Spectator Movement", "Congestion at entrances/exits", "Slips, collisions, minor injuries", 2, 3, 1, 1, 7, "Marked walkways, queue controls", "Marshals, PA announcements", ["SPORTS"]),
    h("Intoxicated Spectators", "Alcohol misuse", "Fights, disorder, injury", 3, 3, 2, 1, 9, "Alcohol policy, bar restrictions", "Security patrols, removal protocol", ["SPORTS"]),
    h("Spectator Encroachment", "Public entering competition area", "Athlete injury, interference", 4, 2, 2, 1, 9, "Barriers, access control", "Security presence courtside/ringside", ["SPORTS"]),
    h("Crowd Overload", "Overcrowding at entrances, exits, stage front", "Crushing, suffocation, panic", 5, 3, 3, 1, 12, "Capacity limits, controlled access, ticket caps", "Queue management, barriers, emergency egress routes", ["EXHIBITION/FESTIVAL"]),
    h("Crowd Surge", "Sudden mass movement toward stage or exits", "Stampede, serious injury, fatalities", 5, 3, 4, 1, 13, "Pit barriers, staggered performances, early warnings", "Crowd spotters, PA announcements, evacuation plan", ["EXHIBITION/FESTIVAL"]),
    h("Queue Congestion", "Bottlenecks at bars, toilets, ticketing", "Pushing, minor injuries, frustration", 2, 3, 2, 1, 8, "Marked queue lanes, clear signage", "Queue marshals, flow control points", ["EXHIBITION/FESTIVAL"]),
    h("Intoxicated Behaviour", "Excessive alcohol / drug use", "Fights, collapse, medical emergencies", 3, 4, 2, 1, 10, "Alcohol policy, ID checks, bar staff training", "Security patrols, refusal-of-service, ejection procedure", ["EXHIBITION/FESTIVAL"]),
    h("Lost Persons", "Lost children or vulnerable adults", "Distress, panic, complaints", 2, 2, 1, 1, 6, "Designated lost child / person point", "Trained staff, PA announcements, registration protocols", ["EXHIBITION/FESTIVAL"]),
  ]},
  // B. Athlete / Participant Safety
  { category: "B. Athlete / Participant Safety", rows: [
    h("Cardiovascular Incident", "Undiagnosed cardiac condition; extreme exertion", "Cardiac arrest, collapse, death", 8, 4, 4, 1, 18, "Entrant medical advisory; pre-race health declaration on entry form", "AED every 2-5km on route; trained first responders at stations; medical director on site", ["MARATHON"]),
    h("Hyperthermia / Heat Stroke", "High ambient temperature during race", "Heat exhaustion, organ failure", 6, 4, 4, 4, 14, "Weather monitoring; race postponement / cancellation protocol; heat advisory", "Ice stations & cool-down zones; IV fluids on standby; dedicated medical team", ["MARATHON"]),
    h("Musculoskeletal Injury / Falls", "Potholes, wet road, uneven surface", "Sprains, fractures, lacerations", 4, 6, 2, 1, 12, "Route inspection & repair 48 hours pre-event; hazard cones / marking", "Marshals with first-aid kits at all stations; stretcher access on route", ["MARATHON"]),
    h("Fatigue / Overexertion", "Runners exceeding fitness level; cut-off pressures", "Collapse, dehydration, DNF", 4, 5, 2, 1, 10, "Participant briefing; enforced cut-off times; sweep vehicle behind field", "Marshal-assisted withdrawal; medical assessment before participant exits course", ["MARATHON"]),
    h("Contact Injury", "Physical contact during sport", "Sprains, fractures, concussions", 4, 3, 2, 1, 10, "Qualified referees, rules enforcement", "Medics on standby, immediate stoppage", ["SPORTS"]),
    h("Equipment Failure", "Gloves, mats, sports gear malfunction", "Injury, cuts, abrasions", 3, 2, 2, 1, 8, "Equipment inspection", "Replacement gear, safety officer checks", ["SPORTS"]),
    h("Playing Surface Issues", "Wet, uneven, loose mats or flooring", "Falls, joint injuries", 3, 3, 2, 1, 9, "Pre-event inspection, mat cleaning", "Continuous monitoring, rapid correction", ["SPORTS"]),
    h("Fatigue / Overexertion", "High-intensity performance", "Collapse, dehydration", 3, 3, 1, 1, 8, "Rest intervals, hydration", "Medical presence, athlete cooldown", ["SPORTS"]),
  ]},
  // C. Security & Public Safety
  { category: "C. Security & Public Safety", rows: [
    h("Unauthorized Vehicle on Course", "Vehicle breaching road closure", "Serious runner injury / fatality", 8, 2, 4, 1, 15, "Full road-closure permit; barrier and cone demarcation at all access points", "Traffic officers at every intersection; barrier vehicles; incident response plan", ["MARATHON"]),
    h("Aggressive / Disruptive Behaviour", "Spectator disputes; confrontational runners", "Injury, disorder", 3, 3, 2, 1, 9, "Visible security presence; code of conduct in race pack", "Rapid-response security team; ejection and SAPS handover protocol", ["MARATHON"]),
    h("Theft in Bag-Drop / Finish Area", "Crowded, high-movement public zones", "Loss of participant valuables", 2, 4, 2, 1, 9, "Secure bag-drop system; CCTV; no-valuables advisory in race brief", "Security patrols; lost & found station; participant signage", ["MARATHON"]),
    h("Unauthorized Access", "Spectators entering athlete areas", "Theft, conflict, injury", 3, 2, 2, 1, 8, "Accreditation, restricted zones", "Security placement", ["SPORTS"]),
    h("Aggressive Behaviour", "Spectator disputes, athlete rivalries", "Injury, disorder", 3, 3, 2, 1, 9, "Visible security", "Rapid intervention teams", ["SPORTS"]),
    h("Theft", "Crowded public areas", "Loss of valuables", 1, 3, 2, 1, 7, "CCTV, signage", "Patrols, lost & found point", ["SPORTS"]),
    h("Unauthorized Entry", "Breach of perimeter or access points", "Theft, assaults, overcrowding", 3, 3, 3, 1, 10, "Secure fencing, restricted access, ticketing checks", "Security checkpoints, accreditation system", ["EXHIBITION/FESTIVAL"]),
    h("Violence / Fights", "Aggressive behaviour in crowd", "Injuries, disorder, evacuations", 4, 3, 2, 1, 10, "Behavioural detection, hotspot monitoring", "Security response teams, removal of offenders", ["EXHIBITION/FESTIVAL"]),
    h("Theft / Pickpocketing", "High-density crowd areas", "Loss of personal property", 1, 4, 2, 1, 8, "Public awareness, CCTV", "Patrols, monitoring of hotspots", ["EXHIBITION/FESTIVAL"]),
    h("Weapon Introduction", "Knives, firearms, dangerous objects", "Severe injury, fatality", 5, 2, 4, 1, 12, "Search procedures, metal detectors", "SAPS liaison, zero-tolerance enforcement", ["EXHIBITION/FESTIVAL"]),
  ]},
  // D. Medical & Health
  { category: "D. Medical & Health", rows: [
    h("Injury During Race", "Falls, contact with barriers / other runners", "Cuts, fractures, concussion", 4, 4, 2, 1, 12, "Qualified medics at all checkpoints; pre-event medical briefing", "Triage stations every 5km; ambulance on standby at finish", ["MARATHON"]),
    h("Dehydration", "Insufficient fluid intake on long-distance events", "Heat exhaustion, muscle failure", 4, 5, 2, 1, 10, "Water tables every 2-3 km; isotonic drink stations on events >10km", "Medics monitoring runners; IV fluids at finish medical tent", ["MARATHON"]),
    h("Hyponatremia", "Over-hydration on marathon / ultra distances", "Seizures, life-threatening fluid imbalance", 6, 3, 2, 1, 11, "Runner education in race pack (hydration guidelines)", "Medical monitoring for distressed finishers; saline drip on standby", ["MARATHON"]),
    h("Illness (Viral / Bacterial Spread)", "Shared water points; large participant numbers", "Gastro illness among runners / volunteers", 2, 3, 1, 1, 6, "Single-use cups; hygiene facilities at all stations", "Sanitizer points; cleaning schedule; food hygiene checks for nutrition stations", ["MARATHON"]),
    h("Injury During Competition", "Sport contact or falls", "Cuts, fractures, concussion", 4, 3, 2, 1, 10, "Qualified medics, pre-screenings", "Triage, ambulance standby", ["SPORTS"]),
    h("Dehydration", "High physical exertion", "Heat exhaustion", 3, 3, 1, 1, 8, "Hydration zones", "Medics monitoring participants", ["SPORTS"]),
    h("Illness", "Viral or bacterial spread", "Sickness among athletes / spectators", 2, 2, 1, 1, 6, "Hygiene facilities", "Sanitizer points, cleaning schedules", ["SPORTS"]),
    h("Heat Stress", "High temperatures, sun exposure", "Heat stroke, dehydration, fainting", 3, 4, 1, 1, 9, "Shade, free/cheap water points", "Medics on site, misting fans, awareness signage", ["EXHIBITION/FESTIVAL"]),
    h("Overdose", "Alcohol or drug misuse", "Collapse, respiratory failure, death", 5, 3, 2, 1, 11, "AOD management plan, bar training", "Medical response, ambulance on standby", ["EXHIBITION/FESTIVAL"]),
    h("Slips/Trips", "Uneven ground, cables, wet surfaces", "Sprains, fractures, minor trauma", 2, 4, 1, 1, 8, "Ground matting, cable covers, non-slip ramps", "Routine inspections, hazard marking", ["EXHIBITION/FESTIVAL"]),
    h("Food Poisoning", "Unsafe food handling", "Illness, hospitalization, complaints", 4, 2, 2, 2, 10, "Vendor vetting, hygiene controls", "Spot checks, enforcement of food safety standards", ["EXHIBITION/FESTIVAL"]),
  ]},
  // E. Fire & Hazardous Material
  { category: "E. Fire & Hazardous Material", rows: [
    h("Generator / Electrical Fire", "Overheated generator or faulty cabling at event village", "Burns, smoke inhalation, explosion", 6, 2, 3, 2, 13, "Generator CoC; 3 m clearance from public area; correct cabling certification", "Fire extinguishers adjacent to generator; power isolation switch; fire marshal", ["MARATHON"]),
    h("Gas / Fuel Storage", "Vendor or generator fuel at event village", "Fire, explosion", 4, 2, 3, 3, 12, "Safe storage per SANS; no naked flames within 5 m", "Fire marshal inspections pre-event and during", ["MARATHON"]),
    h("Blocked Emergency Exits (Event Village)", "Equipment or crowd blocking exit points", "Delayed evacuation", 4, 2, 3, 1, 10, "Clear exit signage; minimum 1.8 m clear width at all exits", "Marshals monitoring exits; regular sweep during event", ["MARATHON"]),
    h("Electrical Fire", "Scoreboards, lighting, audio systems", "Burns, smoke inhalation", 5, 2, 3, 2, 12, "Electrical CoCs, correct cabling", "Fire extinguishers, power isolation", ["SPORTS"]),
    h("Gas / Fuel Storage", "Vendor or generator fuel", "Fire, explosion", 4, 2, 3, 3, 12, "Safe storage, SANS compliance", "Fire marshal inspections", ["SPORTS"]),
    h("Blocked Emergency Exits", "Equipment or crowd blocking exits", "Delayed evacuation", 4, 2, 3, 1, 10, "Clear exit signage", "Marshals monitoring access", ["SPORTS"]),
    h("Electrical Fire", "Faulty wiring, overloading, generators", "Burns, smoke inhalation, fire spread", 5, 2, 4, 2, 13, "Electrical CoCs, correct cabling, dry placement", "Fire extinguishers, isolation switches, inspections", ["EXHIBITION/FESTIVAL"]),
    h("Gas Explosion", "LPG cylinders at vendors", "Major burns, fatalities, structural damage", 5, 2, 4, 3, 14, "SANS-compliant gas setup, trained vendors", "Gas inspections, leak checks, no smoking near gas", ["EXHIBITION/FESTIVAL"]),
    h("Open Flames", "Smoking, cooking, pyrotechnics", "Burns, fire spread, property loss", 4, 2, 3, 2, 11, "Designated smoking area, controlled catering", "Fire marshals, fire equipment, no-open-flame zones", ["EXHIBITION/FESTIVAL"]),
    h("Food Poisoning", "Unsafe food handling", "Illness, hospitalization, complaints", 4, 2, 2, 2, 10, "Vendor vetting, hygiene controls", "Spot checks, enforcement of food safety standards", ["EXHIBITION/FESTIVAL"]),
  ]},
  // F. Weather & Environment
  { category: "F. Weather & Environment", rows: [
    h("Extreme Heat", "Ambient temperature >30°C; high humidity", "Mass heat illness; cardiac events", 6, 3, 2, 2, 13, "Race cancellation / early-start protocol; heat advisory trigger levels defined", "Ice & spray stations every 2 km; extended medical presence; cool-down zone at finish", ["MARATHON"]),
    h("Thunderstorm / Lightning", "Electrical storm during event", "Lightning strike fatality; mass panic", 8, 2, 3, 3, 16, "Weather monitoring system; stop-race protocol if thunder within 8 km", "Shelter points identified on route; PA announcements; marshals radio cascade", ["MARATHON"]),
    h("Heavy Rain / Flash Flood", "Flooding of low-lying route sections", "Participant danger; course modification", 4, 3, 3, 3, 13, "Alternative route pre-identified; rain-trigger threshold defined", "Route inspectors on standby; real-time communication; marshal authority to divert", ["MARATHON"]),
    h("Infrastructure Damage (Wind / Weather)", "Strong gusts destabilizing banners, tents, staging", "Injury, operational downtime", 4, 2, 3, 2, 11, "Temporary structures wind-load certified; banner removal policy >60 km/h", "Structural check monitoring of event; standby team for rapid takedown", ["MARATHON"]),
    h("Heat (Outdoor)", "High temperatures during matches", "Heat stroke", 3, 3, 1, 1, 8, "Shade, water access", "Medical readiness", ["SPORTS"]),
    h("Slippery Surfaces", "Rain, condensation, sweat on mats", "Falls, sprains", 3, 3, 2, 1, 9, "Anti-slip mats, ventilation", "Cleaning teams", ["SPORTS"]),
    h("Infrastructure Damage", "Weather impact on outdoor venues", "Injury, operational downtime", 3, 2, 3, 2, 10, "Pre-event inspection", "Structural maintenance", ["SPORTS"]),
    h("High Winds", "Wind on stages, tents, branding", "Collapse, serious injury, fatalities", 5, 3, 4, 3, 15, "Wind monitoring, structural certifications", "Shutdown thresholds, ballast/anchoring, engineer sign-off", ["EXHIBITION/FESTIVAL"]),
    h("Lightning", "Outdoor elevated structures", "Electrocution, panic", 5, 2, 3, 3, 13, "Lightning detection and weather monitoring", "Evacuation to shelter, suspension of show", ["EXHIBITION/FESTIVAL"]),
    h("Heavy Rain", "Water pooling, mud, slippery surfaces", "Falls, electrical hazards, damage", 3, 4, 2, 2, 11, "Ground protection, drainage planning", "Walkway matting, re-routing of pedestrians", ["EXHIBITION/FESTIVAL"]),
  ]},
  // G. Infrastructure & Equipment
  { category: "G. Infrastructure & Equipment", rows: [
    h("Stage / Podium Failure", "Awards stage or timing gantry collapse", "Falls, impact injuries", 4, 2, 2, 1, 9, "Proper assembly per supplier spec; structural sign-off", "Daily checks; load limit signs; no unauthorized access to stage", ["MARATHON"]),
    h("Timing & PA System Failure", "Chip timing mats fall; PA system down", "Event disruption; communication failure", 2, 3, 2, 1, 8, "Backup timing system; manual backup for elite field", "IT support on-site; fallback manual recording; spare PA equipment", ["MARATHON"]),
    h("Power Outage", "Loss of lighting, timing, scoring systems", "Safety risk at night starts; event disruption", 4, 3, 2, 1, 10, "Backup generator; UPS for critical systems", "Emergency lighting in standby; electrician on call", ["MARATHON"]),
    h("Water Station Equipment Failure", "Trestle tables collapse; water containers fail", "Water shortage; injury", 2, 3, 2, 1, 8, "Station pre-assembly check; over-order supplies by 20%", "Station monitors with radio; mobile water vehicle on route", ["MARATHON"]),
    h("Stage/Podium Failure", "Awards stage collapse", "Falls, impact injuries", 3, 2, 2, 1, 8, "Proper assembly", "Daily checks", ["SPORTS"]),
    h("Seating System Failure", "Temporary stands, bleachers", "Collapse injuries", 4, 2, 3, 1, 10, "Engineering checks", "Load limits, post-setup inspection", ["SPORTS"]),
    h("Power Outage", "Loss of lighting, scoring systems", "Event disruption", 2, 3, 2, 1, 8, "Backup power", "UPS, emergency lighting", ["SPORTS"]),
    h("Stage Collapse", "Structural failure or overload", "Serious injury, fatalities, major loss", 5, 1, 5, 2, 13, "Engineer design & sign-off, load limits", "Daily inspections, wind thresholds, exclusion zones", ["EXHIBITION/FESTIVAL"]),
    h("Tent/Marquee Failure", "Poor anchoring, wind", "Collapse onto public", 4, 2, 3, 2, 11, "Correct pegging/ballast, structure checks", "Weather monitoring, staged evacuation", ["EXHIBITION/FESTIVAL"]),
    h("Power Outage", "Generator failure, fuel issues", "Show interruption, panic, security impact", 2, 3, 3, 1, 9, "Redundant generators, fuel management", "UPS for critical systems, refueling plan", ["EXHIBITION/FESTIVAL"]),
  ]},
  // H. Traffic & Logistics
  { category: "H. Traffic & Logistics", rows: [
    h("Traffic Congestion at Venue", "Arrival & departure peak volumes", "Delays; emergency vehicle access blocked", 4, 3, 2, 2, 11, "Detailed traffic management plan; directional signage 5 km out", "Traffic officers at key intersections; marshals directing flow; park-and-ride option", ["MARATHON"]),
    h("Pedestrian / Vehicle Conflict in Parking", "Cars moving in pedestrian walkways", "Serious injury", 6, 2, 3, 1, 12, "Separated pedestrian paths; speed limits and humps in parking area", "Marshals guiding pedestrians; barriers between parking and walkways", ["MARATHON"]),
    h("Equipment Movement Hazard", "Forklifts / staging vehicles moving near public", "Crush or impact injuries", 4, 2, 3, 1, 10, "Vehicle movement plan; pedestrian-free windows for heavy equipment", "Banksman required; spotters; physical barriers when operating", ["MARATHON"]),
    h("Bus / Shuttle Accident (Point-to-Point Events)", "Contracted transport for runners to start line", "Multiple passenger injuries", 6, 2, 3, 2, 13, "Roadworthy certification; licensed drivers only; pre-event route survey", "Emergency response plan; spare vehicle standby; passenger manifest held at base", ["MARATHON"]),
    h("Traffic Congestion", "Arrival & departure peaks", "Delays, emergency access issues", 2, 3, 2, 2, 9, "Traffic plan", "Marshals, signage", ["SPORTS"]),
    h("Pedestrian Collision", "Cars in parking zones", "Serious injury", 5, 1, 3, 1, 19, "Pedestrian paths", "Barriers, speed limits", ["SPORTS"]),
    h("Equipment Movement", "Sports equipment, staging gear", "Crush or impact injuries", 3, 2, 3, 1, 9, "Restricted movement times", "Supervisors, spotters", ["SPORTS"]),
    h("Traffic Congestion", "High event traffic volume", "Delays, blocked emergency routes", 2, 4, 2, 2, 10, "Traffic management plan, route planning", "Traffic marshals, SAPS/Metro coordination", ["EXHIBITION/FESTIVAL"]),
    h("Overdose", "Alcohol or drug misuse", "Collapse, respiratory failure, death", 5, 3, 2, 1, 11, "AOD management plan, bar training", "Medical response, ambulance on standby", ["EXHIBITION/FESTIVAL"]),
  ]},
  // I. Waste & Sanitation
  { category: "I. Waste & Sanitation", rows: [
    h("Inadequate Portable Toilets", "Under-provision for participant numbers", "Illness, odors, queue congestion", 2, 4, 2, 3, 11, "Ratio: 1 toilet per 75-100 participants; servicing schedule", "Contractor oversight; topping-up team on standby; extra units at start", ["MARATHON"]),
    h("Overflowing Waste Bins", "High-volume litter at start / finish and water stations", "Hygiene issues; slip hazard", 2, 3, 1, 2, 8, "Waste management plan; extra capacity at high-traffic zones", "Roving waste team; additional bags on standby", ["MARATHON"]),
    h("Slippery Spills from Water Stations", "Spilled water and cups on road surface", "Falls; ankle injuries", 2, 5, 2, 1, 8, "Sweep teams following last runners through each station; anti-slip matting", "Cones around major spill areas; rapid-response cleaning team", ["MARATHON"]),
    h("Medical Waste Disposal", "Used needles, dressings, biohazard material at medical points", "Infection risk to staff and public", 4, 2, 2, 2, 10, "Medical waste protocol; sharps containers at all medical stations", "Certified waste disposal contractor; PPE mandatory for all medical staff", ["MARATHON"]),
    h("Overflowing Bins", "Poor rotation", "Hygiene issues", 1, 3, 1, 3, 8, "Waste plan", "Contractor oversight", ["SPORTS"]),
    h("Inadequate Toilets", "Insufficient capacity", "Illness, odors, complaints", 2, 3, 2, 3, 10, "Sufficient toilets, servicing", "Cleaning teams", ["SPORTS"]),
    h("Spillage", "Cleaning chemical / drinks spills", "Slips, contamination", 2, 2, 2, 2, 8, "Spill kits", "Cleaning staff", ["SPORTS"]),
    h("Overflowing Bins", "Inadequate collection schedule", "Odors, pests, litter", 1, 3, 1, 3, 8, "Waste schedule, adequate bins", "Contractor monitoring, rapid response", ["EXHIBITION/FESTIVAL"]),
    h("Chemical Spill", "Fuel, cleaning chemicals", "Contamination, burns, pollution", 3, 1, 3, 4, 11, "Safe storage, bunding, training", "Spill kits, environmental officer", ["EXHIBITION/FESTIVAL"]),
    h("Inadequate Toilets", "Too few units or poor servicing", "Illness, complaints, environmental impact", 2, 3, 2, 3, 10, "Sufficient toilets, service rotations", "Cleaning teams, inspections", ["EXHIBITION/FESTIVAL"]),
  ]},
  // J. Emergency Situations
  { category: "J. Emergency Situations", rows: [
    h("Active Threat", "Armed attacker or violent person at event", "Fatalities; mass panic", 8, 1, 5, 1, 15, "SAPS deployment plan; accreditation-only access to event village", "Lockdown / evacuation protocol; dedicated SAPS liaison officer on site", ["MARATHON"]),
    h("Bomb Threat", "Suspicious device reported at venue or on route", "Panic; mass evacuation", 6, 1, 4, 2, 12, "Participant and bag screening at start; security briefing", "SAPS bomb squad protocol; evacuation assembly points pre-identified", ["MARATHON"]),
    h("Mass Causality Incident", "Multiple simultaneous participant collapses (cardiac / heat)", "Overwhelmed medical services", 8, 2, 4, 1, 15, "Medical staffing ratio (1 medic per 250 runners); triage protocol pre-briefed", "Triage zone at finish; multiple ambulances on standby; hospital pre-notification", ["MARATHON"]),
    h("Missing Runner (Trail / Ultra)", "Runner injured or lost off course", "Delayed rescue; hypothermia; death", 6, 3, 3, 2, 14, "Mandatory GPS tracker for trail/ultra events; sweep vehicle behind last runner", "Search-and-rescue protocol; SAPS / mountain rescue liaison; cut-off enforcement", ["MARATHON"]),
    h("Active Threat", "Armed attacker / violent person", "Fatalities", 5, 1, 5, 1, 12, "SAPS coordination", "Lockdown / evacuation", ["SPORTS"]),
    h("Bomb Threat", "Suspicious device", "Panic, evacuation", 5, 1, 4, 2, 12, "Screening, vigilance", "SAPS bomb squad protocol", ["SPORTS"]),
    h("Mass Casualty", "Multiple injuries from competition or stands", "Overwhelmed medical services", 4, 2, 3, 1, 10, "Medical planning", "Triage, ambulances", ["SPORTS"]),
    h("Active Threat", "Armed or violent attacker", "Multiple injuries, fatalities", 5, 1, 5, 1, 12, "SAPS liaison, intelligence gathering", "Lockdown/evacuation plan, trained command structure", ["EXHIBITION/FESTIVAL"]),
    h("Bomb Threat", "Suspected or actual device", "Panic, evacuation, damage", 5, 1, 4, 1, 12, "Screening processes, suspicious object awareness", "SAPS bomb protocol, controlled evacuation", ["EXHIBITION/FESTIVAL"]),
    h("Medical MCI", "Multiple casualties at once", "Overwhelmed medical resources", 4, 2, 3, 1, 10, "Scaled medical plan, surge capacity", "Triage system, ambulance coordination", ["EXHIBITION/FESTIVAL"]),
  ]},
];

export function riskBand(r) {
  if (r <= 6) return { label: "LOW", color: "8BC34A" };
  if (r <= 16) return { label: "MEDIUM", color: "FDDB07" };
  if (r <= 32) return { label: "HIGH", color: "F4A11D" };
  return { label: "CRITICAL", color: "DE1819" };
}

// Returns hazard categories filtered to rows applicable to the given event type.
export function hazardsForEventType(eventType) {
  return HAZARD_LIBRARY.map((cat) => ({
    category: cat.category,
    rows: cat.rows.filter((row) => row.tags.includes(eventType)),
  })).filter((cat) => cat.rows.length > 0);
}
