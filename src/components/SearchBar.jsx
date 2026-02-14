import { useState, useEffect, useRef } from "react";
import { searchPlayers } from "../utils/nhlApi";

export default function SearchBar({ onSelectPlayer }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchPlayers(query);
        setResults(data);
        setIsOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(player) {
    setQuery(player.name);
    setIsOpen(false);
    onSelectPlayer(player);
  }

  return (
    <div ref={wrapperRef} className="search-wrapper">
      <div className="search-input-row">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search any NHL player…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {searching && <span className="search-spinner" />}
      </div>

      {isOpen && (
        <ul className="search-dropdown">
          {results.map((p) => (
            <li
              key={p.id}
              className="search-result-item"
              onMouseDown={() => handleSelect(p)}
            >
              <span className="result-name">{p.name}</span>
              <span className="result-meta">
                {p.team} · {p.position}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
}
