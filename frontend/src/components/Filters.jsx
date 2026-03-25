function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select
        className="field__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Filters({
  meta,
  stateValue,
  yearValue,
  categoryValue,
  onStateChange,
  onYearChange,
  onCategoryChange,
}) {
  const stateOptions = [
    { value: "All", label: "All States" },
    ...(meta.states || []).map((s) => ({ value: s, label: s })),
  ];

  const yearOptions = [
    { value: "All", label: "All Years" },
    ...(meta.years || []).map((y) => ({ value: String(y), label: String(y) })),
  ];

  const categoryOptions = [
    { value: "All", label: "All Food Categories" },
    ...(meta.categories || []).map((c) => ({ value: c, label: c })),
  ];

  return (
    <section className="filters">
      <SelectField
        label="State"
        value={stateValue}
        options={stateOptions}
        onChange={onStateChange}
      />
      <SelectField
        label="Year"
        value={yearValue}
        options={yearOptions}
        onChange={onYearChange}
      />
      <SelectField
        label="Food Category"
        value={categoryValue}
        options={categoryOptions}
        onChange={onCategoryChange}
      />
    </section>
  );
}

