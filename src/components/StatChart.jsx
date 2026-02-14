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
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "points", label: "Points" },
];

const GOALIE_METRICS = [
  { key: "wins", label: "Wins" },
  { key: "losses", label: "Losses" },
  { key: "shutouts", label: "Shutouts" },
];

const SKATER_COLORS = {
  goals: "#e63946",
  assists: "#457b9d", 
  points: "#f4a261",
};

const GOALIE_COLORS = {
  wins: "#2a9d8f",
  losses: "#e63946",
  shutouts: "#457b9d",
};

export default function StatChart({ 
  seasonStats, 
  position, 
  players, 
  availableLeagues,
  selectedLeague,
  onLeagueChange
}) {
  const [chartType, setChartType] = useState("line");

  // Compare mode: multiple players
  if (players && players.length > 0) {
    const isGoalie = players[0].position === "G";
    const metrics = isGoalie ? GOALIE_METRICS : SKATER_METRICS;
    const colors = isGoalie ? GOALIE_COLORS : SKATER_COLORS;

    // Get all unique seasons across all players
    const allSeasons = new Set();
    players.forEach(p => {
      p.seasonStats.forEach(s => allSeasons.add(s.season));
    });
    const sortedSeasons = Array.from(allSeasons).sort((a, b) => a - b);

    // Build merged data structure
    const chartData = sortedSeasons.map(season => {
      const row = { season: formatSeason(season) };
      
      players.forEach((player, idx) => {
        const seasonData = player.seasonStats.find(s => s.season === season);
        if (seasonData) {
          row[`goals_${idx}`] = seasonData.goals;
          row[`assists_${idx}`] = seasonData.assists;
          row[`points_${idx}`] = seasonData.points;
          row[`wins_${idx}`] = seasonData.wins;
          row[`losses_${idx}`] = seasonData.losses;
          row[`shutouts_${idx}`] = seasonData.shutouts;
        }
      });
      
      return row;
    });

    return (
      <div className="stat-chart">
        <div className="chart-header">
          <h3 className="chart-title">Career Comparison</h3>
          <div className="chart-controls">
             {availableLeagues && availableLeagues.length > 1 && (
            <select 
              value={selectedLeague} 
              onChange={(e) => onLeagueChange(e.target.value)}
              className="league-select"
            >
              {availableLeagues.map(league => (
                <option key={league} value={league}>{league}</option>
              ))}
            </select>
          )}
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
        </div>

        <ResponsiveContainer width="100%" height={320}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
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
                iconType="line"
              />
              
              {/* Render all metrics for each player */}
              {players.map((player, playerIdx) => (
                metrics.map((metric) => (
                  <Line
                    key={`${playerIdx}-${metric.key}`}
                    type="monotone"
                    dataKey={`${metric.key}_${playerIdx}`}
                    name={`${player.name} - ${metric.label}`}
                    stroke={colors[metric.key]}
                    strokeWidth={2}
                    strokeDasharray={playerIdx === 0 ? "0" : "5 5"} // Solid vs dashed
                    dot={{ r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData}>
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
                iconType="rect"
              />
              
              {players.map((player, playerIdx) => (
                metrics.map((metric) => (
                  <Bar
                    key={`${playerIdx}-${metric.key}`}
                    dataKey={`${metric.key}_${playerIdx}`}
                    name={`${player.name} - ${metric.label}`}
                    fill={colors[metric.key]}
                    opacity={playerIdx === 0 ? 1 : 0.7} // Differentiate players
                    radius={[3, 3, 0, 0]}
                  />
                ))
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  }

  // Single player mode - also update to show all metrics at once
  if (!seasonStats || seasonStats.length === 0) return null;

  const isGoalie = position === "G";
  const metrics = isGoalie ? GOALIE_METRICS : SKATER_METRICS;
  const colors = isGoalie ? GOALIE_COLORS : SKATER_COLORS;

  const chartData = seasonStats.map((s) => ({
    season: formatSeason(s.season),
    goals: s.goals,
    assists: s.assists,
    points: s.points,
    wins: s.wins,
    losses: s.losses,
    shutouts: s.shutouts,
  }));

  const ChartComponent = chartType === "bar" ? BarChart : LineChart;

 return (
  <div className="stat-chart">
    <div className="chart-header">
      <h3 className="chart-title">Career Stats by Season</h3>
      <div className="chart-controls">
        {/* League selector - ADD THIS */}
        {availableLeagues && availableLeagues.length > 1 && (
          <select 
            value={selectedLeague} 
            onChange={(e) => onLeagueChange(e.target.value)}
            className="league-select"
          >
            {availableLeagues.map(league => (
              <option key={league} value={league}>{league}</option>
            ))}
          </select>
        )}
        
        {/* Chart type toggle */}
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
            iconType={chartType === "bar" ? "rect" : "line"}
          />
          
          {metrics.map((m) =>
            chartType === "bar" ? (
              <Bar 
                key={m.key} 
                dataKey={m.key} 
                name={m.label} 
                fill={colors[m.key]} 
                radius={[3,3,0,0]} 
              />
            ) : (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={colors[m.key]}
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