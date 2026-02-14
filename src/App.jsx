import SearchBar from "./components/SearchBar";
import PlayerCard from "./components/PlayerCard";
import StatChart from "./components/StatChart";
import StatsTable from "./components/StatsTable";
import CompareStats from "./components/CompareStats";
import { usePlayer } from "./hooks/usePlayer";
import "./App.css";
import { useState } from "react";

export default function App() {
  const [compareMode, setCompareMode] = useState(false);  // Fixed casing
  const player1 = usePlayer();
  const player2 = usePlayer();

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

      <main className="app-main">
        {/* Compare toggle */}
        <button 
          className="compare-toggle"
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? "Exit Compare" : "Compare Players"}
        </button>

        {/* Search - conditional rendering */}
        <div className="search-section">
          {compareMode ? (
            <div className="compare-search-grid">
              <SearchBar onSelectPlayer={(p) => player1.loadPlayer(p.id)} />
              <SearchBar onSelectPlayer={(p) => player2.loadPlayer(p.id)} />
            </div>
          ) : (
            <SearchBar onSelectPlayer={(p) => player1.loadPlayer(p.id)} />
            
          )}
          
        </div>

        {/* Loading state */}
        {(player1.loading || player2.loading) && (
          <div className="state-message">
            <div className="loader" />
            <p>Loading player data…</p>
          </div>
          
        )}

        {/* Error state */}
        {(player1.error || player2.error) && (
          <div className="state-message error">
            <p>⚠️ {player1.error || player2.error}</p>
            <button onClick={() => {
              player1.clearPlayer();
              player2.clearPlayer();
            }} className="btn-secondary">
              Try again
            </button>
          </div>
        )}

        {/* Compare mode - two players */}
{compareMode && player1.player && player2.player && (
  <div className="compare-grid">
    <div className="player-content">
      <PlayerCard player={player1.player} />
      {/* Removed individual charts */}
    </div>
    <div className="player-content">
      <PlayerCard player={player2.player} />
    </div>
  </div>
)}

{/* Combined chart for compare mode */}
{compareMode && player1.player && player2.player && (
  <>
    <StatChart 
      players={[
        { 
          name: `${player1.player.firstName?.default} ${player1.player.lastName?.default}`,
          seasonStats: player1.seasonStats, 
          position: player1.player.position 
        },
        { 
          name: `${player2.player.firstName?.default} ${player2.player.lastName?.default}`,
          seasonStats: player2.seasonStats, 
          position: player2.player.position 
        }
      ]}
    />
    
    {/* Career totals comparison */}
    <CompareStats 
      player1={player1.player}
      player2={player2.player}
      seasonStats1={player1.seasonStats}
      seasonStats2={player2.seasonStats}
    />
  </>
)}

        {/* Single player mode */}
        {!compareMode && player1.player && (
  <div className="player-content">
    <PlayerCard player={player1.player} />
    <StatChart 
      seasonStats={player1.seasonStats} 
      position={player1.player.position}
      availableLeagues={player1.availableLeagues}
      selectedLeague={player1.selectedLeague}
      onLeagueChange={player1.changeLeague}
    />
    <StatsTable 
      seasonStats={player1.seasonStats} 
      position={player1.player.position} 
    />
  </div>
)}

        {/* Empty state */}
        {!player1.loading && !player1.player && (
          <div className="empty-state">
            <div className="empty-icon">🏒</div>
            <p>Search for a player to explore their career stats</p>
          </div>
        )}
      </main>
    </div>
  );
}