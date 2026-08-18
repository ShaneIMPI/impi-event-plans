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
    const handleFile = (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        onChange(field.id, null);
        return;
      }
      // Convert to a base64 data URL immediately, rather than storing the raw
      // File object in state. Raw Files get auto-saved into IndexedDB with the
      // draft, and browsers (Chrome in particular) can silently invalidate a
      // File's readable handle once it's been through IndexedDB — causing a
      // "NotReadableError" the next time the app tries to read its bytes.
      // A plain base64 string has none of that risk and round-trips through
      // IndexedDB perfectly.
      const reader = new FileReader();
      reader.onload = () => onChange(field.id, reader.result);
      reader.onerror = () => onChange(field.id, null);
      reader.readAsDataURL(file);
    };
    return <input {...commonProps} type="file" accept="image/*" onChange={handleFile} />;
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
