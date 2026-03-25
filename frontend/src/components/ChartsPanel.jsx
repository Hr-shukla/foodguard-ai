import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function ChartCard({ title, children }) {
  return (
    <div className="chartCard">
      <div className="chartCard__title">{title}</div>
      <div className="chartCard__body">{children}</div>
    </div>
  );
}

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"];
const SERIES_COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24", "#fb7185", "#22c55e"];

function EmptyState() {
  return (
    <div className="emptyState">
      No data for the current filters.
    </div>
  );
}

export default function ChartsPanel({ stateStackData, trendData, trendKeys, pieData }) {
  const keys = Array.isArray(trendKeys) && trendKeys.length ? trendKeys : ["total"];

  const hasBar = Array.isArray(stateStackData) && stateStackData.length > 0;
  const hasLine = Array.isArray(trendData) && trendData.length > 0;
  const hasPie = Array.isArray(pieData) && pieData.length > 0;

  return (
    <section className="charts">
      <ChartCard title="State-wise Contamination (Stacked by Category)">
        {hasBar ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stateStackData} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((k, idx) => (
                <Bar
                  key={k}
                  dataKey={k}
                  stackId="a"
                  fill={SERIES_COLORS[idx % SERIES_COLORS.length]}
                  radius={[10, 10, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </ChartCard>

      <ChartCard title="Year-wise Trends (Multi-line by Category)">
        {hasLine ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((k, idx) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  stroke={SERIES_COLORS[idx % SERIES_COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </ChartCard>

      <ChartCard title="Food Category Distribution (Pie)">
        {hasPie ? (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Tooltip />
              <Pie data={pieData} dataKey="cases" nameKey="category" outerRadius={110}>
                {pieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${entry.category}`}
                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </ChartCard>

      <ChartCard title="Top States (Horizontal Bar)">
        {hasBar ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={stateStackData.slice(0, 8).map((r) => ({ state: r.state, cases: r.total ?? 0 }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="state" width={110} />
              <Tooltip />
              <Bar dataKey="cases" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </ChartCard>

      <ChartCard title="Category Trend (Area)">
        {Array.isArray(trendData) && trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#06b6d4"
                fill="rgba(6, 182, 212, 0.25)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </ChartCard>

      <ChartCard title="Cases Scatter (Year vs Cases)">
        {Array.isArray(trendData) && trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" type="number" domain={["dataMin", "dataMax"]} />
              <YAxis dataKey="total" type="number" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter name="Cases" data={trendData} fill="#a855f7" />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </ChartCard>
    </section>
  );
}

