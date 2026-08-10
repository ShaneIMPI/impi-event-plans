const AVAILABLE = [
  { id: "safety", label: "Safety Management Plan" },
  { id: "security", label: "Security Management Plan" },
  { id: "parking", label: "Parking Management Plan" },
  { id: "riskAssessment", label: "Event Risk Assessment" },
  { id: "traffic", label: "Traffic Management Plan" },
  { id: "evacuation", label: "Emergency Evacuation Plan" },
];

const COMING_SOON = [];

export default function ModuleToggles({ toggled, onChange }) {
  const toggle = (id) => {
    const next = toggled.includes(id) ? toggled.filter((m) => m !== id) : [...toggled, id];
    onChange(next);
  };

  return (
    <div className="module-toggles">
      <h3>Documents to Generate</h3>
      <div className="toggle-grid">
        {AVAILABLE.map((m) => (
          <label key={m.id} className={`toggle-card ${toggled.includes(m.id) ? "active" : ""}`}>
            <input type="checkbox" checked={toggled.includes(m.id)} onChange={() => toggle(m.id)} />
            {m.label}
          </label>
        ))}
      </div>
      {COMING_SOON.length > 0 && (
        <>
          <h4 className="coming-soon-label">Coming in a later phase</h4>
          <div className="toggle-grid">
            {COMING_SOON.map((m) => (
              <label key={m.id} className="toggle-card disabled">
                <input type="checkbox" disabled />
                {m.label}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
