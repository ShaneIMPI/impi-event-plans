import { buildQuestionnaire, CORE_FIELDS } from "../data/questionnaire";
import FieldInput from "./FieldInput";
import RiskClassificationStep from "./RiskClassificationStep";

export default function Questionnaire({ toggledModules, answers, onChange }) {
  const fields = buildQuestionnaire(toggledModules);
  const coreIds = new Set(CORE_FIELDS.map((f) => f.id));
  const coreFields = fields.filter((f) => coreIds.has(f.id));
  const moduleFields = fields.filter((f) => !coreIds.has(f.id));

  return (
    <div className="questionnaire">
      <h3>Core Event Details</h3>
      <div className="field-grid">
        {coreFields.map((field) => (
          <div className="field-block" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <FieldInput field={field} value={answers[field.id]} onChange={onChange} />
          </div>
        ))}
      </div>

      {moduleFields.length > 0 && (
        <>
          <h3>Additional Questions (based on selected documents)</h3>
          <p className="hint">
            Answered once here — shared automatically between the Safety and Security plans where relevant.
          </p>
          <div className="field-grid">
            {moduleFields.map((field) => (
              <div className="field-block" key={field.id}>
                <label htmlFor={field.id}>{field.label}</label>
                <FieldInput field={field} value={answers[field.id]} onChange={onChange} />
              </div>
            ))}
          </div>
        </>
      )}

      {toggledModules.includes("riskAssessment") && (
        <RiskClassificationStep value={answers.raClassification} onChange={onChange} />
      )}
    </div>
  );
}
