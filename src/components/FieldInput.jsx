export default function FieldInput({ field, value, onChange }) {
  const commonProps = {
    id: field.id,
    className: "field-input",
  };

  if (field.type === "textarea") {
    return (
      <textarea
        {...commonProps}
        rows={3}
        value={value || ""}
        placeholder={field.placeholder || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select {...commonProps} value={value || ""} onChange={(e) => onChange(field.id, e.target.value)}>
        <option value="">Select…</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (opt) => {
      const next = selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt];
      onChange(field.id, next);
    };
    return (
      <div className="multiselect">
        {field.options.map((opt) => (
          <label key={opt} className="checkbox-row">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <input
        {...commonProps}
        type="file"
        accept="image/*"
        onChange={(e) => onChange(field.id, e.target.files?.[0] || null)}
      />
    );
  }

  return (
    <input
      {...commonProps}
      type={field.type === "number" ? "number" : "text"}
      value={value || ""}
      placeholder={field.placeholder || ""}
      onChange={(e) => onChange(field.id, e.target.value)}
    />
  );
}
