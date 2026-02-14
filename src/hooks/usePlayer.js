import { useState, useCallback } from "react";
import { getPlayerLanding, extractSeasonStats, getPlayerLeagues } from "../utils/nhlApi";

export function usePlayer() {
  const [player, setPlayer] = useState(null);
  const [seasonStats, setSeasonStats] = useState([]);
  const [availableLeagues, setAvailableLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('NHL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawPlayerData, setRawPlayerData] = useState(null);

  const loadPlayer = useCallback(async (playerId) => {
  setLoading(true);
  setError(null);
  setPlayer(null);
  setSeasonStats([]);

  try {
    const data = await getPlayerLanding(playerId);
    
    setRawPlayerData(data);
    setPlayer(data);
    
    // Extract available leagues and add "ALL" at the beginning
    const leagues = getPlayerLeagues(data);
    const leaguesWithAll = leagues.length > 1 ? ['ALL', ...leagues] : leagues;
    setAvailableLeagues(leaguesWithAll);
    
    // Default to NHL if they played there, otherwise "ALL"
    const defaultLeague = leagues.includes('NHL') ? 'NHL' : (leagues.length > 1 ? 'ALL' : leagues[0]);
    setSelectedLeague(defaultLeague);
    
    setSeasonStats(extractSeasonStats(data, { leagueFilter: defaultLeague }));
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}, []);

  const changeLeague = useCallback((league) => {
    if (rawPlayerData) {
      setSelectedLeague(league);
      setSeasonStats(extractSeasonStats(rawPlayerData, { leagueFilter: league }));
    }
  }, [rawPlayerData]);

  const clearPlayer = useCallback(() => {
    setPlayer(null);
    setSeasonStats([]);
    setAvailableLeagues([]);
    setSelectedLeague('NHL');
    setRawPlayerData(null);
    setError(null);
  }, []);

  return { 
    player, 
    seasonStats, 
    availableLeagues,
    selectedLeague,
    loading, 
    error, 
    loadPlayer, 
    changeLeague,
    clearPlayer 
  };
}
