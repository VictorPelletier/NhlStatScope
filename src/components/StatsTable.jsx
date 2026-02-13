import { formatSeason } from "../utils/nhlApi";

export default function StatsTable({ seasonStats, position }) {
  if (!seasonStats || seasonStats.length === 0) return null;

  const isGoalie = position === "G";

  // Reverse so most recent season is first
  const rows = [...seasonStats].reverse();

  return (
    <div className="stats-table-wrapper">
      <h3 className="chart-title">Season-by-Season</h3>
      <div className="table-scroll">
        <table className="stats-table">
          <thead>
            <tr>
              <th>Season</th>
              <th>Team</th>
              <th>GP</th>
              {isGoalie ? (
                <>
                  <th>W</th>
                  <th>L</th>
                  <th>OTL</th>
                  <th>GAA</th>
                  <th>SV%</th>
                  <th>SO</th>
                </>
              ) : (
                <>
                  <th>G</th>
                  <th>A</th>
                  <th>PTS</th>
                  <th>+/−</th>
                  <th>PIM</th>
                  <th>PPG</th>
                  <th>SHG</th>
                  <th>S</th>
                  <th>S%</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr key={i} className={i === 0 ? "row-current" : ""}>
                <td className="season-cell">{formatSeason(s.season)}</td>
                <td>{s.teamName?.default ?? "—"}</td>
                <td>{s.gamesPlayed ?? "—"}</td>
                {isGoalie ? (
                  <>
                    <td>{s.wins ?? "—"}</td>
                    <td>{s.losses ?? "—"}</td>
                    <td>{s.otLosses ?? "—"}</td>
                    <td>{s.goalsAgainstAvg?.toFixed(2) ?? "—"}</td>
                    <td>{s.savePctg?.toFixed(3) ?? "—"}</td>
                    <td>{s.shutouts ?? "—"}</td>
                  </>
                ) : (
                  <>
                    <td>{s.goals ?? "—"}</td>
                    <td>{s.assists ?? "—"}</td>
                    <td className="pts-cell">{s.points ?? "—"}</td>
                    <td
                      className={
                        s.plusMinus > 0
                          ? "positive"
                          : s.plusMinus < 0
                          ? "negative"
                          : ""
                      }
                    >
                      {s.plusMinus != null
                        ? (s.plusMinus > 0 ? "+" : "") + s.plusMinus
                        : "—"}
                    </td>
                    <td>{s.pim ?? "—"}</td>
                    <td>{s.powerPlayGoals ?? "—"}</td>
                    <td>{s.shorthandedGoals ?? "—"}</td>
                    <td>{s.shots ?? "—"}</td>
                    <td>
                      {s.shootingPctg != null
                        ? `${(s.shootingPctg * 100).toFixed(1)}%`
                        : "—"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
