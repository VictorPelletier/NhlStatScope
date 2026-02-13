import { useState, useCallback } from "react";
import { getPlayerLanding, extractSeasonStats } from "../utils/nhlApi";

export function usePlayer() {
  const [player, setPlayer] = useState(null);
  const [seasonStats, setSeasonStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPlayer = useCallback(async (playerId) => {
    setLoading(true);
    setError(null);
    setPlayer(null);
    setSeasonStats([]);

    try {
      const data = await getPlayerLanding(playerId);
      setPlayer(data);
      setSeasonStats(extractSeasonStats(data));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPlayer = useCallback(() => {
    setPlayer(null);
    setSeasonStats([]);
    setError(null);
  }, []);

  return { player, seasonStats, loading, error, loadPlayer, clearPlayer };
}
