import { useState, useEffect } from "react";
import { getAllTeams, getTeamRoster } from "../utils/nhlApi";

export default function TeamBrowser({ onSelectPlayer }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [roster, setRoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Load all teams on mount
  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await getAllTeams();
        setTeams(data);
      } catch (err) {
        console.error("Failed to load teams:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  // Load roster when team is selected
  const handleTeamClick = async (team) => {
    setSelectedTeam(team);
    setLoadingRoster(true);
    try {
      const data = await getTeamRoster(team.abbrev);
      setRoster(data);
    } catch (err) {
      console.error("Failed to load roster:", err);
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleBack = () => {
    setSelectedTeam(null);
    setRoster(null);
  };

  if (loading) {
    return (
      <div className="team-browser-loading">
        <div className="loader" />
        <p>Loading teams…</p>
      </div>
    );
  }

  // Team grid view
  if (!selectedTeam) {
    return (
      <div className="team-browser">
        <h2 className="browser-title">Browse by Team</h2>
        <div className="team-grid">
          {teams.map((team) => (
            <div
              key={team.id}
              className="team-card"
              onClick={() => handleTeamClick(team)}
            >
              <img src={team.logo} alt={team.name} className="team-card-logo" />
              <span className="team-card-name">{team.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Roster view
  const allPlayers = [
    ...(roster?.forwards || []),
    ...(roster?.defensemen || []),
    ...(roster?.goalies || []),
  ];

  return (
    <div className="team-roster">
      <button onClick={handleBack} className="back-button">
        ← Back to Teams
      </button>

      <div className="roster-header">
        <img src={selectedTeam.logo} alt={selectedTeam.name} className="roster-team-logo" />
        <h2 className="roster-team-name">{selectedTeam.name}</h2>
      </div>

      {loadingRoster ? (
        <div className="state-message">
          <div className="loader" />
          <p>Loading roster…</p>
        </div>
      ) : (
        <div className="roster-grid">
          {allPlayers.map((player) => (
            <div
              key={player.id}
              className="roster-player-card"
              onClick={() => onSelectPlayer({ id: player.id })}
            >
              <img
                src={player.headshot}
                alt={player.firstName?.default + " " + player.lastName?.default}
                className="roster-player-img"
              />
              <div className="roster-player-info">
                <span className="roster-player-number">#{player.sweaterNumber}</span>
                <span className="roster-player-name">
                  {player.firstName?.default} {player.lastName?.default}
                </span>
                <span className="roster-player-position">{player.positionCode}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}