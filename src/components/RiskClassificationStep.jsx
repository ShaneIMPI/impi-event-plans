import { CLASSIFICATION_CATEGORIES, SCORE_OPTIONS, computeRiskClassification } from "../data/riskClassification";

export default function RiskClassificationStep({ value, onChange }) {
  const raClassification = value || {};

  const setScore = (categoryId, itemIndex, score) => {
    const nextCategory = { ...(raClassification[categoryId] || {}), [itemIndex]: score };
    onChange("raClassification", { ...raClassification, [categoryId]: nextCategory });
  };

  const result = computeRiskClassification(raClassification);

  return (
    <div className="risk-classification">
      <h3>Event Risk Classification (Section 5)</h3>
      <p className="hint">
        Score each item that applies to this event as Low, Medium, or High. Leave items that don't apply as N/A.
        The Total Risk Rating and band update live and will be printed into the Risk Assessment document.
      </p>

      {CLASSIFICATION_CATEGORIES.map((cat) => {
        const catResult = result.categoryResults.find((c) => c.id === cat.id);
        return (
          <div className="ra-category" key={cat.id}>
            <div className="ra-category-header">
              <h4>{cat.title}</h4>
              <span className="ra-category-score">Category total: {catResult.total}</span>
            </div>
            <div className="ra-item-list">
              {cat.items.map((item, idx) => {
                const current = raClassification[cat.id]?.[idx] ?? 0;
                return (
                  <div className="ra-item-row" key={idx}>
                    <span className="ra-item-label">{item}</span>
                    <div className="ra-segmented">
                      {SCORE_OPTIONS.map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          className={`ra-seg-btn ra-seg-${opt.label.toLowerCase()} ${current === opt.value ? "active" : ""}`}
                          onClick={() => setScore(cat.id, idx, opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="ra-total-band" style={{ borderColor: `#${result.band.color}` }}>
        <div className="ra-total-figure">
          Total Risk Rating: <strong>{result.total}</strong>
        </div>
        <div className="ra-total-label" style={{ backgroundColor: `#${result.band.color}` }}>
          {result.band.label} — {result.band.sub}
        </div>
      </div>
    </div>
  );
}
