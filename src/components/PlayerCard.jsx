export default function PlayerCard({ player }) {
  if (!player) return null;

  const {
    firstName,
    lastName,
    headshot,
    teamLogo,
    position,
    sweaterNumber,
    heightInInches,
    weightInPounds,
    birthDate,
    birthCity,
    birthCountry,
    shootsCatches,
    featuredStats,
  } = player;

  const fullName = `${firstName?.default ?? ""} ${lastName?.default ?? ""}`;
  const currentStats = featuredStats?.regularSeason?.subSeason;
  const isGoalie = position === "G";

  function formatHeight(inches) {
    if (!inches) return "—";
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}′${inch}″`;
  }

  function calcAge(dob) {
    if (!dob) return "—";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  return (
    <div className="player-card">
      <div className="player-card-header">
        {headshot && (
          <img src={headshot} alt={fullName} className="player-headshot" />
        )}
        <div className="player-info">
          <div className="player-number">#{sweaterNumber ?? "—"}</div>
          <h2 className="player-name">{fullName}</h2>
          <div className="player-meta">
            {teamLogo && (
              <img src={teamLogo} alt="team logo" className="team-logo-small" />
            )}
            <span>{position}</span>
            <span className="dot">·</span>
            <span>Shoots/Catches: {shootsCatches ?? "—"}</span>
          </div>
          <div className="player-bio">
            <span>{formatHeight(heightInInches)}</span>
            <span className="dot">·</span>
            <span>{weightInPounds ? `${weightInPounds} lbs` : "—"}</span>
            <span className="dot">·</span>
            <span>Age {calcAge(birthDate)}</span>
            <span className="dot">·</span>
            <span>
              {birthCity?.default ?? "—"}, {birthCountry ?? ""}
            </span>
          </div>
        </div>
      </div>

      {currentStats && (
        <div className="current-stats">
          <h3 className="stats-label">This Season</h3>
          <div className="stat-pills">
            {isGoalie ? (
              <>
                <StatPill label="GP" value={currentStats.gamesPlayed} />
                <StatPill label="W" value={currentStats.wins} />
                <StatPill label="L" value={currentStats.losses} />
                <StatPill
                  label="GAA"
                  value={currentStats.goalsAgainstAvg?.toFixed(2)}
                />
                <StatPill
                  label="SV%"
                  value={currentStats.savePctg?.toFixed(3)}
                />
                <StatPill label="SO" value={currentStats.shutouts} />
              </>
            ) : (
              <>
                <StatPill label="GP" value={currentStats.gamesPlayed} />
                <StatPill label="G" value={currentStats.goals} />
                <StatPill label="A" value={currentStats.assists} />
                <StatPill
                  label="PTS"
                  value={currentStats.points}
                  highlight
                />
                <StatPill label="+/−" value={currentStats.plusMinus} />
                <StatPill label="PIM" value={currentStats.pim} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value, highlight }) {
  return (
    <div className={`stat-pill ${highlight ? "stat-pill--highlight" : ""}`}>
      <span className="stat-value">{value ?? "—"}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
