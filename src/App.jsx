import SearchBar from "./components/SearchBar";
import PlayerCard from "./components/PlayerCard";
import StatChart from "./components/StatChart";
import StatsTable from "./components/StatsTable";
import { usePlayer } from "./hooks/usePlayer";
import "./App.css";

export default function App() {
  const { player, seasonStats, loading, error, loadPlayer, clearPlayer } =
    usePlayer();

  function handleSelectPlayer(result) {
    loadPlayer(result.id);
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🏒</span>
            <span className="logo-text">NHL StatScope</span>
          </div>
          <p className="header-sub">Career stats for every player in the league</p>
        </div>
      </header>

      {/* Search */}
      <main className="app-main">
        <div className="search-section">
          <SearchBar onSelectPlayer={handleSelectPlayer} />
        </div>

        {/* States */}
        {loading && (
          <div className="state-message">
            <div className="loader" />
            <p>Loading player data…</p>
          </div>
        )}

        {error && (
          <div className="state-message error">
            <p>⚠️ {error}</p>
            <button onClick={clearPlayer} className="btn-secondary">
              Try again
            </button>
          </div>
        )}

        {/* Player content */}
        {!loading && !error && player && (
          <div className="player-content">
            <PlayerCard player={player} />
            <StatChart seasonStats={seasonStats} position={player.position} />
            <StatsTable seasonStats={seasonStats} position={player.position} />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !player && (
          <div className="empty-state">
            <div className="empty-icon">🏒</div>
            <p>Search for a player to explore their career stats</p>
            <div className="empty-suggestions">
              <span>Try: </span>
              {["Connor McDavid", "Sidney Crosby", "Auston Matthews"].map(
                (name) => (
                  <button
                    key={name}
                    className="suggestion-chip"
                    onClick={() => {
                      // Fake a search result to trigger load
                      // Real app would look up the ID first
                    }}
                  >
                    {name}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
