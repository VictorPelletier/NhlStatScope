// In dev, Vite proxies these to avoid CORS
// /nhl-api  → https://api-web.nhle.com
// /nhl-stats → https://api.nhle.com

/**
 * Search for players by name using the NHL Stats REST API.
 * Returns an array of { id, name, team, position } objects.
 */
export async function searchPlayers(query) {
  if (!query || query.trim().length < 2) return [];

  // The stats REST API supports full-text search via cayenneExp
  const params = new URLSearchParams({
    limit: "10",
    sort: "lastName",
    dir: "asc",
    cayenneExp: `fullName likeIgnoreCase "%${query.trim()}%"`,
  });

  const res = await fetch(`/nhl-stats/stats/rest/en/players?${params}`);
  if (!res.ok) throw new Error("Failed to search players");

  const data = await res.json();

  return (data.data || []).map((p) => ({
    id: p.id,
    name: p.fullName ?? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
    team: p.teamAbbrevName ?? "—",
    position: p.positionCode ?? "—",
  }));
}


/**
 * Fetch full player details + career stats.
 * Returns the full player landing object from the NHL API.
 */
export async function getPlayerLanding(playerId) {
  const res = await fetch(`/nhl-api/v1/player/${playerId}/landing`);
  if (!res.ok) throw new Error(`Failed to fetch player ${playerId}`);
  return res.json();
}

/**
 * Pull out season stats from a player landing object, optionally filtered by league.
 * sorted oldest → newest.
 */
export function extractSeasonStats(playerLanding, options = {}) {
  const { gameTypeId = 2, leagueFilter = null } = options;
  
  let seasons = playerLanding?.seasonTotals?.filter(
    (s) => s.gameTypeId === gameTypeId
  ) || [];

  // Filter by league if specified
  if (leagueFilter && leagueFilter !== 'ALL') {
    seasons = seasons.filter(s => s.leagueAbbrev === leagueFilter);
  }

  return seasons.sort((a, b) => a.season - b.season);
}

/**
 * Get all unique leagues a player has played in (regular season only)
 */
export function getPlayerLeagues(playerLanding) {
  const regularSeasonStats = playerLanding?.seasonTotals?.filter(
    (s) => s.gameTypeId === 2
  ) || [];
  
  const leagues = [...new Set(regularSeasonStats.map(s => s.leagueAbbrev))];
  
 
  return leagues.sort((a, b) => {
    if (a === 'NHL') return -1;
    if (b === 'NHL') return 1;
    return a.localeCompare(b);
  });
}

export async function getAllTeams() {
  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`/nhl-api/v1/standings/${today}`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  const data = await res.json();
  
  return data.standings.map(team => ({
    id: team.teamAbbrev.default,
    name: team.teamName.default,
    abbrev: team.teamAbbrev.default,
    logo: team.teamLogo,
    conference: team.conferenceName,
    division: team.divisionName,
  }));
}

export async function getTeamRoster(teamAbbrev) {
  const res = await fetch(`/nhl-api/v1/roster/${teamAbbrev}/20252026`);
  if (!res.ok) throw new Error(`Failed to fetch roster for ${teamAbbrev}`);
  return res.json();
}
/**
 * Get draft prospects by category for a specific year
 * Categories: 1 - NA Skater, 2 - Intl Skater, 3 - NA Goalie, 4 - Intl Goalie
 */
export async function getDraftRankings(year = 2026, category = 1) {
  const res = await fetch(`/nhl-api/v1/draft/rankings/${year}/${category}`);
  if (!res.ok) throw new Error(`Failed to fetch ${year} draft rankings`);
  const data = await res.json();
  
  return data.rankings || [];
}

/**
 * Format a season number like 20232024 → "2023–24"
 */
export function formatSeason(season) {
  const s = String(season);
  return `${s.slice(0, 4)}–${s.slice(6)}`;
}