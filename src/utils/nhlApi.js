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
 * Pull out just the regular season stats from a player landing object,
 * sorted oldest → newest.
 */
export function extractSeasonStats(playerLanding) {
  const seasons =
    playerLanding?.seasonTotals?.filter(
      (s) => s.gameTypeId === 2 // 2 = regular season
    ) || [];

  return seasons.sort((a, b) => a.season - b.season);
}

/**
 * Format a season number like 20232024 → "2023–24"
 */
export function formatSeason(season) {
  const s = String(season);
  return `${s.slice(0, 4)}–${s.slice(6)}`;
}