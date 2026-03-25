import { useEffect, useMemo, useState } from "react";
import { fetchInsights } from "../api/apiClient";

function formatNum(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function Pill({ label, value }) {
  return (
    <div className="aiPill">
      <div className="aiPill__label">{label}</div>
      <div className="aiPill__value">{value}</div>
    </div>
  );
}

export default function AIInsights({ filters }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setStatus("loading");
        setError(null);
        const res = await fetchInsights(filters);
        if (cancelled) return;
        setInsights(res);
        setStatus("success");
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load AI insights");
        setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filters?.state, filters?.year, filters?.category]);

  const headline = useMemo(() => {
    if (!insights) return null;
    const t = insights?.totals;
    const topS = insights?.top?.state;
    const topC = insights?.top?.category;
    if (!t) return null;
    return `Analyzed ${formatNum(t.records)} records • ${formatNum(t.total_cases)} cases`;
    // extra details shown below
  }, [insights]);

  return (
    <div className="aiCard">
      <div className="aiCard__head">
        <div>
          <div className="aiCard__title">AI Insights</div>
          <div className="aiCard__sub">
            {status === "loading"
              ? "Generating insights…"
              : status === "error"
                ? "Could not generate insights"
                : headline}
          </div>
        </div>
        <div className="aiBadge">offline</div>
      </div>

      {status === "error" ? <div className="aiError">{error}</div> : null}

      {status === "success" && insights ? (
        <>
          <div className="aiGrid">
            <Pill
              label="Top State"
              value={
                insights.top?.state
                  ? `${insights.top.state.name} (${formatNum(insights.top.state.cases)})`
                  : "—"
              }
            />
            <Pill
              label="Top Category"
              value={
                insights.top?.category
                  ? `${insights.top.category.name} (${formatNum(insights.top.category.cases)})`
                  : "—"
              }
            />
            <Pill
              label="Forecast"
              value={
                insights.forecast
                  ? `${insights.forecast.year}: ~${formatNum(insights.forecast.predicted_cases)}`
                  : "—"
              }
            />
            <Pill
              label="Anomalies"
              value={formatNum(Array.isArray(insights.anomalies) ? insights.anomalies.length : 0)}
            />
          </div>

          <div className="aiSplit">
            <div>
              <div className="aiSectionTitle">Recommendations</div>
              <ul className="aiList">
                {(insights.recommendations || []).slice(0, 4).map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
                {(insights.recommendations || []).length === 0 ? (
                  <li>No recommendations for current filters.</li>
                ) : null}
              </ul>
            </div>

            <div>
              <div className="aiSectionTitle">Top anomalies</div>
              <ul className="aiList">
                {(insights.anomalies || []).slice(0, 4).map((a, idx) => (
                  <li key={idx}>
                    <strong>{a.state}</strong> • {a.year} • {a.food_category} •{" "}
                    {formatNum(a.contamination_cases)}
                  </li>
                ))}
                {(insights.anomalies || []).length === 0 ? (
                  <li>No spikes detected for current filters.</li>
                ) : null}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

