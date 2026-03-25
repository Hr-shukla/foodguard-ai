import { useMemo, useState } from "react";

function formatCases(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="field field--compact">
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

export default function DataTable({ rows, states }) {
  const [tableState, setTableState] = useState("All");

  const filtered = useMemo(() => {
    const base = Array.isArray(rows) ? rows : [];
    if (tableState === "All") return base;
    return base.filter((r) => r?.state === tableState);
  }, [rows, tableState]);

  // Show a representative preview when All States is selected.
  const view = useMemo(() => {
    const base = filtered.slice();
    base.sort((a, b) => {
      // Newest year first; then higher cases; then state name.
      if (a.year !== b.year) return b.year - a.year;
      const ac = Number(a.contamination_cases || 0);
      const bc = Number(b.contamination_cases || 0);
      if (ac !== bc) return bc - ac;
      return String(a.state).localeCompare(String(b.state));
    });
    return base.slice(0, 18);
  }, [filtered]);

  const stateOptions = [
    { value: "All", label: "All States" },
    ...(states || []).map((s) => ({ value: s, label: s })),
  ];

  return (
    <div className="tableCard">
      <div className="tableCard__head">
        <div className="tableCard__title">Data Explorer</div>
        <div className="tableCard__controls">
          <SelectField
            label="State (table)"
            value={tableState}
            options={stateOptions}
            onChange={setTableState}
          />
        </div>
      </div>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>State</th>
              <th>Year</th>
              <th>Category</th>
              <th className="num">Cases</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r, idx) => (
              <tr key={`${r.state}-${r.year}-${r.food_category}-${idx}`}>
                <td>{r.state}</td>
                <td>{r.year}</td>
                <td>{r.food_category}</td>
                <td className="num">{formatCases(r.contamination_cases)}</td>
              </tr>
            ))}
            {view.length === 0 ? (
              <tr>
                <td colSpan={4} className="emptyRow">
                  No records for current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="tableCard__foot">
        Showing {view.length} of {filtered.length}
      </div>
    </div>
  );
}

