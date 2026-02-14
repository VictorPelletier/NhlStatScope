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
    currentTeamAbbrev,
    fullTeamName,
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

  // Helper to remove accents and slugify
  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Removes accents: ý→y, š→s, é→e
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  // Team abbreviation to GearGeek slug mapping
  const TEAM_SLUGS = {
    'ANA': 'anaheim-ducks',
    'BOS': 'boston-bruins',
    'BUF': 'buffalo-sabres',
    'CAR': 'carolina-hurricanes',
    'CBJ': 'columbus-blue-jackets',
    'CGY': 'calgary-flames',
    'CHI': 'chicago-blackhawks',
    'COL': 'colorado-avalanche',
    'DAL': 'dallas-stars',
    'DET': 'detroit-red-wings',
    'EDM': 'edmonton-oilers',
    'FLA': 'florida-panthers',
    'LAK': 'los-angeles-kings',
    'MIN': 'minnesota-wild',
    'MTL': 'montreal-canadiens',
    'NJD': 'new-jersey-devils',
    'NSH': 'nashville-predators',
    'NYI': 'new-york-islanders',
    'NYR': 'new-york-rangers',
    'OTT': 'ottawa-senators',
    'PHI': 'philadelphia-flyers',
    'PIT': 'pittsburgh-penguins',
    'SEA': 'seattle-kraken',
    'SJS': 'san-jose-sharks',
    'STL': 'st-louis-blues',
    'TBL': 'tampa-bay-lightning',
    'TOR': 'toronto-maple-leafs',
    'VAN': 'vancouver-canucks',
    'VGK': 'vegas-golden-knights',
    'WPG': 'winnipeg-jets',
    'WSH': 'washington-capitals',
    'UTA': 'utah-mammoth',
  };

  const teamSlug = TEAM_SLUGS[currentTeamAbbrev] || 'nhl';
  const playerSlug = slugify(fullName);
  const gearGeekUrl = `https://www.geargeek.com/team/${teamSlug}/${playerSlug}`;

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
          
          {/* Gear link */}
          <a 
            href={gearGeekUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gear-link"
          >
            View Equipment →
          </a>
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