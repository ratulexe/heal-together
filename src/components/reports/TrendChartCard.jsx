import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length || payload[0].value == null) return null

  return (
    <div className="rounded-xl border border-ht-border bg-white px-3 py-2 text-sm shadow-[0_12px_30px_rgba(5,31,32,0.08)]">
      <p className="font-semibold text-ht-ink">{label}</p>
      <p className="mt-1 text-ht-muted">
        {payload[0].value} {unit}
      </p>
    </div>
  )
}

function EmptyChartState({ message }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-ht-border bg-ht-background px-6 text-center">
      <p className="max-w-sm text-sm leading-6 text-ht-muted">{message}</p>
    </div>
  )
}

function TrendChartCard({
  title,
  summary,
  data,
  dataKey,
  unit,
  color = "#0FA3A0",
  kind = "bar",
  yDomain,
  emptyMessage,
}) {
  const hasData = data.some((item) => item[dataKey] != null && Number.isFinite(Number(item[dataKey])))
  const Chart = kind === "line" ? LineChart : BarChart

  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ht-muted">{summary}</p>
      </div>

      <div className="mt-5" aria-hidden="true">
        {hasData ? (
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <Chart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="#CDE7D3" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5A6B6C", fontSize: 12 }}
                />
                <YAxis
                  domain={yDomain}
                  allowDecimals
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5A6B6C", fontSize: 12 }}
                  width={42}
                />
                <Tooltip content={<ChartTooltip unit={unit} />} />
                {kind === "line" ? (
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: color, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                    connectNulls={false}
                  />
                ) : (
                  <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
                )}
              </Chart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChartState message={emptyMessage} />
        )}
      </div>
    </section>
  )
}

export default TrendChartCard
