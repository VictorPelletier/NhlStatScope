import { useState, useEffect } from "react";
import { getDraftRankings, searchPlayers } from "../utils/nhlApi";

const CATEGORIES = [
  { id: 1, name: "North American Skaters" },
  { id: 2, name: "International Skaters" },
  { id: 3, name: "North American Goalies" },
  { id: 4, name: "International Goalies" },
];

export default function ProspectBrowser({ onSelectPlayer }) {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedCategory, setSelectedCategory] = useState(1);

  useEffect(() => {
    async function loadProspects() {
      setLoading(true);
      try {
        const data = await getDraftRankings(selectedYear, selectedCategory);
        setProspects(data);
      } catch (err) {
        console.error("Failed to load prospects:", err);
        setProspects([]);
      } finally {
        setLoading(false);
      }
    }
    loadProspects();
  }, [selectedYear, selectedCategory]);

  const handleProspectClick = async (prospect) => {
    try {
      const searchResults = await searchPlayers(`${prospect.firstName} ${prospect.lastName}`);
      if (searchResults.length > 0) {
        // Found them in NHL database - load their stats
        onSelectPlayer({ id: searchResults[0].id });
      } else {
        // Not in NHL yet (still a prospect)
        alert(`${prospect.firstName} ${prospect.lastName} hasn't played in the NHL yet`);
      }
    } catch (err) {
      console.error("Failed to search player:", err);
      alert("Error loading player stats");
    }
  };

  if (loading) {
    return (
      <div className="prospect-browser-loading">
        <div className="loader" />
        <p>Loading {selectedYear} draft prospects…</p>
      </div>
    );
  }

  return (
    <div className="prospect-browser">
      <div className="prospect-header">
        <h2 className="browser-title">{selectedYear} NHL Draft Rankings</h2>
        <div className="prospect-filters">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="year-select"
          >
            {[2027,2026,2025, 2024, 2023, 2022, 2021].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="category-select"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="prospect-grid">
        {prospects.map((prospect, index) => (
          <div
            key={`${prospect.id}-${index}`}
            className="prospect-card"
            onClick={() => handleProspectClick(prospect)}
          >
            <div className="prospect-rank">
              <span className="rank-number">#{prospect.rank || index + 1}</span>
            </div>
            <div className="prospect-player-info">
              <span className="prospect-name">
                {prospect.firstName} {prospect.lastName}
              </span>
              <span className="prospect-position">{prospect.positionCode}</span>
              <span className="prospect-team">{prospect.lastTeamName}</span>
              <span className="prospect-league">{prospect.lastLeagueName}</span>
            </div>
          </div>
        ))}
      </div>

      {prospects.length === 0 && (
        <div className="empty-state">
          <p>No rankings available for {selectedYear}</p>
        </div>
      )}
    </div>
  );
}