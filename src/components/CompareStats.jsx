export default function CompareStats({ player1, player2, seasonStats1, seasonStats2 }) {
  // Calculate career totals
  const calcTotals = (stats) => {
    return stats.reduce((acc, s) => ({
      games: acc.games + (s.gamesPlayed || 0),
      goals: acc.goals + (s.goals || 0),
      assists: acc.assists + (s.assists || 0),
      points: acc.points + (s.points || 0),
      plusMinus: acc.plusMinus + (s.plusMinus || 0),
      wins: acc.wins + (s.wins || 0),
      shutouts: acc.shutouts + (s.shutouts || 0),
    }), { games: 0, goals: 0, assists: 0, points: 0, plusMinus: 0, wins: 0, shutouts: 0 });
  };

  const totals1 = calcTotals(seasonStats1);
  const totals2 = calcTotals(seasonStats2);
  
  const isGoalie = player1.position === "G" || player2.position === "G";

  // Helper to determine who's leading
  const leader = (val1, val2) => {
    if (val1 > val2) return 1;
    if (val2 > val1) return 2;
    return 0; // tie
  };

  const stats = isGoalie ? [
    { label: "Games Played", val1: totals1.games, val2: totals2.games },
    { label: "Wins", val1: totals1.wins, val2: totals2.wins },
    { label: "Shutouts", val1: totals1.shutouts, val2: totals2.shutouts },
  ] : [
    { label: "Games Played", val1: totals1.games, val2: totals2.games },
    { label: "Goals", val1: totals1.goals, val2: totals2.goals },
    { label: "Assists", val1: totals1.assists, val2: totals2.assists },
    { label: "Points", val1: totals1.points, val2: totals2.points },
    { label: "+/−", val1: totals1.plusMinus, val2: totals2.plusMinus, signed: true },
  ];

  return (
    <div className="compare-stats">
      <h3 className="compare-stats-title">Career Totals</h3>
      <div className="compare-stats-grid">
        {stats.map((stat, i) => {
          const lead = leader(stat.val1, stat.val2);
          return (
            <div key={i} className="compare-stat-row">
              <div className={`stat-value ${lead === 1 ? 'leading' : ''}`}>
                {stat.signed && stat.val1 > 0 ? '+' : ''}{stat.val1}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-value ${lead === 2 ? 'leading' : ''}`}>
                {stat.signed && stat.val2 > 0 ? '+' : ''}{stat.val2}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="compare-summary">
        <div className="summary-player">
          <span className="summary-name">
            {player1.firstName?.default} {player1.lastName?.default}
          </span>
          <span className="summary-record">
            {seasonStats1.length} {seasonStats1.length === 1 ? 'season' : 'seasons'}
          </span>
        </div>
        <div className="summary-vs">VS</div>
        <div className="summary-player">
          <span className="summary-name">
            {player2.firstName?.default} {player2.lastName?.default}
          </span>
          <span className="summary-record">
            {seasonStats2.length} {seasonStats2.length === 1 ? 'season' : 'seasons'}
          </span>
        </div>
      </div>
    </div>
  );
}