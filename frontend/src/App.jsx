import { useMemo, useState } from "react";
import Filters from "./components/Filters.jsx";
import KPICards from "./components/KPICards.jsx";
import ChartsPanel from "./components/ChartsPanel.jsx";
import { useFoodData } from "./hooks/useFoodData.js";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import DataTable from "./components/DataTable.jsx";
import AIInsights from "./components/AIInsights.jsx";

function formatCases(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "N/A";
  return n.toLocaleString();
}

function ErrorBanner({ message, onReload }) {
  return (
    <div className="banner banner--error" role="alert">
      <div className="banner__title">Could not load data</div>
      <div className="banner__message">{message}</div>
      <button className="btn btn--primary" onClick={onReload} type="button">
        Reload
      </button>
    </div>
  );
}

export default function App() {
  const { data, meta, status, error } = useFoodData();

  const [stateValue, setStateValue] = useState("All");
  const [yearValue, setYearValue] = useState("All");
  const [categoryValue, setCategoryValue] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [activeNav, setActiveNav] = useState("overview");

  const filteredData = useMemo(() => {
    const yearNum =
      yearValue === "All" ? null : Number.parseInt(String(yearValue), 10);
    const q = String(searchValue || "").trim().toLowerCase();

    return (data || []).filter((row) => {
      if (!row) return false;
      if (stateValue !== "All" && row.state !== stateValue) return false;
      if (yearNum !== null && Number(row.year) !== yearNum) return false;
      if (categoryValue !== "All" && row.food_category !== categoryValue)
        return false;
      if (q) {
        const hay = `${row.state} ${row.food_category} ${row.year}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, stateValue, yearValue, categoryValue, searchValue]);

  const { stateStackData, trendData, trendKeys, pieData, kpis } = useMemo(() => {
    const totalCases = filteredData.reduce(
      (sum, row) => sum + Number(row.contamination_cases || 0),
      0
    );

    const categoryAgg = new Map();
    const statesSet = new Set();
    const categoriesSet = new Set();

    // Stacked state-wise (each state with category segments).
    const stateToCategory = new Map(); // state -> Map(category -> cases)

    // Multi-series trends: year -> Map(category -> cases)
    const yearToCategory = new Map();

    for (const row of filteredData) {
      const cases = Number(row.contamination_cases || 0);

      categoryAgg.set(row.food_category, (categoryAgg.get(row.food_category) || 0) + cases);
      statesSet.add(row.state);
      categoriesSet.add(row.food_category);

      if (!stateToCategory.has(row.state)) stateToCategory.set(row.state, new Map());
      const sMap = stateToCategory.get(row.state);
      sMap.set(row.food_category, (sMap.get(row.food_category) || 0) + cases);

      if (!yearToCategory.has(row.year)) yearToCategory.set(row.year, new Map());
      const yMap = yearToCategory.get(row.year);
      yMap.set(row.food_category, (yMap.get(row.food_category) || 0) + cases);
    }

    const keys =
      categoryValue === "All"
        ? Array.from(categoriesSet).sort((a, b) => a.localeCompare(b))
        : [categoryValue];

    const stacked = Array.from(stateToCategory.entries()).map(([state, cMap]) => {
      const row = { state, total: 0 };
      for (const k of keys) {
        const v = cMap.get(k) || 0;
        row[k] = v;
        row.total += v;
      }
      return row;
    });

    stacked.sort((a, b) => b.total - a.total);
    const stateStack = stacked.slice(0, stateValue === "All" ? 12 : 1);

    const trend = Array.from(yearToCategory.entries())
      .map(([year, cMap]) => {
        const row = { year };
        for (const k of keys) row[k] = cMap.get(k) || 0;
        row.total = keys.reduce((s, k) => s + (row[k] || 0), 0);
        return row;
      })
      .sort((a, b) => a.year - b.year);

    const pie = Array.from(categoryAgg.entries())
      .map(([category, cases]) => ({ category, cases }))
      .sort((a, b) => b.cases - a.cases);

    const mostAffected = stateStack[0];
    const mostUnsafe = pie[0];

    return {
      stateStackData: stateStack,
      trendData: trend,
      trendKeys: keys,
      pieData: pie,
      kpis: {
        totalCases,
        uniqueStates: statesSet.size,
        uniqueCategories: categoriesSet.size,
        avgCasesPerRecord:
          filteredData.length > 0 ? Math.round(totalCases / filteredData.length) : 0,
        mostAffectedState: mostAffected ? mostAffected.state : null,
        mostUnsafeFood: mostUnsafe ? mostUnsafe.category : null,
      },
    };
  }, [filteredData]);

  const isLoading = status === "loading" || status === "idle";

  function navigateTo(id) {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="layout">
      <Sidebar activeId={activeNav} onNavigate={navigateTo} />
      <div className="layout__main">
        <Topbar searchValue={searchValue} onSearchChange={setSearchValue} />

        <main className="page">
          {status === "error" ? (
            <ErrorBanner message={error} onReload={() => window.location.reload()} />
          ) : null}

          <div className="page__header">
            <div>
              <h1 className="page__title">Food Safety Data Dashboard</h1>
              <p className="page__subtitle">
                Explore state-wise contamination, year-wise trends, and food category
                distribution.
              </p>
            </div>
            <div className="page__kpiHint">
              <div className="hintPill">
                Most affected: <strong>{kpis.mostAffectedState || "N/A"}</strong>
              </div>
              <div className="hintPill">
                Most unsafe: <strong>{kpis.mostUnsafeFood || "N/A"}</strong>
              </div>
            </div>
          </div>

          <section id="overview">
            <Filters
              meta={meta}
              stateValue={stateValue}
              yearValue={yearValue}
              categoryValue={categoryValue}
              onStateChange={setStateValue}
              onYearChange={setYearValue}
              onCategoryChange={setCategoryValue}
            />
          </section>

          {isLoading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <>
              <KPICards kpis={kpis} />
              <AIInsights
                filters={{
                  state: stateValue,
                  year: yearValue,
                  category: categoryValue,
                }}
              />
              <section id="analytics">
                <ChartsPanel
                  stateStackData={stateStackData}
                  trendData={trendData}
                  trendKeys={trendKeys}
                  pieData={pieData}
                />
              </section>
              <section id="data">
                <DataTable rows={filteredData} states={meta.states} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

