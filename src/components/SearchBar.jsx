import { useState, useEffect, useRef } from "react";
import { searchPlayers } from "../utils/nhlApi";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


export default function SearchBar({ onSelectPlayer }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  const{
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript){
      setQuery(transcript);
    }
  }, [transcript]);

  // Debounced search
  useEffect(() => {
    if (transcript){
      setQuery(transcript);
    }
  }, [transcript]);

 
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

  
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  useEffect(() => {    
    if(results.length === 1 && transcript && !listening){
      setTimeout(() => {
        handleSelect(results[0]);
        resetTranscript();
      }, 500);
    }
  }, [results, transcript, listening]);
  function handleSelect(player) {
    setQuery(player.name);
    setIsOpen(false);
    onSelectPlayer(player);
  }
  const handleVoiceSearch = () => {
    if(listening){
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

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
          {browserSupportsSpeechRecognition && (
          <button 
            className={`voice-button ${listening ? 'listening' : ''}`}
            onClick={handleVoiceSearch}
            title={listening ? "Stop listening" : "Voice search"}
          >
            {listening ? '🎤' : '🎙️'}
          </button>
        )}
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
