function formatCases(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "N/A";
  return n.toLocaleString();
}

function Card({ title, value, tone = "tone-indigo", icon = "●" }) {
  return (
    <div className={`kpi kpi--color ${tone}`}>
      <div className="kpi__top">
        <div className="kpi__icon" aria-hidden="true">
          {icon}
        </div>
        <div className="kpi__title">{title}</div>
      </div>
      <div className="kpi__value">{value}</div>
    </div>
  );
}

export default function KPICards({ kpis }) {
  return (
    <section className="kpis">
      <Card
        title="Total Cases"
        value={formatCases(kpis.totalCases)}
        tone="tone-green"
        icon="Σ"
      />
      <Card
        title="Unique States"
        value={formatCases(kpis.uniqueStates)}
        tone="tone-purple"
        icon="⧉"
      />
      <Card
        title="Unique Categories"
        value={formatCases(kpis.uniqueCategories)}
        tone="tone-blue"
        icon="◫"
      />
      <Card
        title="Avg. Cases / Record"
        value={formatCases(kpis.avgCasesPerRecord)}
        tone="tone-orange"
        icon="μ"
      />
    </section>
  );
}

