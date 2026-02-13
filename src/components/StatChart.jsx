import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { formatSeason } from "../utils/nhlApi";

const SKATER_METRICS = [
  { key: "goals", label: "Goals", color: "#e63946" },
  { key: "assists", label: "Assists", color: "#457b9d" },
  { key: "points", label: "Points", color: "#f4a261" },
];

const GOALIE_METRICS = [
  { key: "wins", label: "Wins", color: "#2a9d8f" },
  { key: "losses", label: "Losses", color: "#e63946" },
  { key: "shutouts", label: "Shutouts", color: "#457b9d" },
];

export default function StatChart({ seasonStats, position }) {
  const [chartType, setChartType] = useState("line");
  const isGoalie = position === "G";
  const metrics = isGoalie ? GOALIE_METRICS : SKATER_METRICS;

  if (!seasonStats || seasonStats.length === 0) return null;

  const chartData = seasonStats.map((s) => ({
    season: formatSeason(s.season),
    goals: s.goals,
    assists: s.assists,
    points: s.points,
    wins: s.wins,
    losses: s.losses,
    shutouts: s.shutouts,
    gamesPlayed: s.gamesPlayed,
    savePctg: s.savePctg ? parseFloat(s.savePctg.toFixed(3)) : undefined,
    goalsAgainstAvg: s.goalsAgainstAvg
      ? parseFloat(s.goalsAgainstAvg.toFixed(2))
      : undefined,
  }));

  const ChartComponent = chartType === "bar" ? BarChart : LineChart;

  return (
    <div className="stat-chart">
      <div className="chart-header">
        <h3 className="chart-title">Career Stats by Season</h3>
        <div className="chart-toggle">
          <button
            className={`toggle-btn ${chartType === "line" ? "active" : ""}`}
            onClick={() => setChartType("line")}
          >
            Line
          </button>
          <button
            className={`toggle-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
          >
            Bar
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis
            dataKey="season"
            tick={{ fontSize: 11, fill: "#8b9ab0" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#8b9ab0" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0d1b2a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#e0e8f0", fontWeight: 600 }}
          />
          <Legend
            wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
          />
          {metrics.map((m) =>
            chartType === "bar" ? (
              <Bar key={m.key} dataKey={m.key} name={m.label} fill={m.color} radius={[3,3,0,0]} />
            ) : (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            )
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
