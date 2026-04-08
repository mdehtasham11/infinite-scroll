import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setSearchData } from "../../redux/searchSlice";

const suggestions = [
  "Nature landscapes",
  "Abstract art",
  "City architecture",
  "Sunset photography",
  "Minimalist design",
];

const SearchBar = ({ onAfterSearch } = {}) => {
  const [search,    setSearch]    = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  const submit = (query) => {
    const q = query.trim();
    if (!q) return;
    dispatch(setSearchData(q));
    setIsFocused(false);
    onAfterSearch?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(search);
  };

  const clearSearch = () => {
    setSearch("");
    dispatch(setSearchData(""));
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: "flex",
          alignItems: "center",
          border: `1px solid ${isFocused ? "var(--gold)" : "var(--border)"}`,
          background: "var(--surface)",
          transition: "border-color 0.2s",
        }}>
          <div style={{
            padding: "10px 14px",
            borderRight: "1px solid var(--border)",
            color: isFocused ? "var(--gold)" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            transition: "color 0.2s",
          }}>
            <FaSearch size={12} />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder="Search images..."
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.5px",
              color: "var(--text)",
            }}
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaTimes size={10} />
            </button>
          )}

          <button
            type="submit"
            disabled={!search.trim()}
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderLeft: "1px solid var(--border)",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: search.trim() ? "var(--gold)" : "var(--text-dim)",
              cursor: search.trim() ? "pointer" : "not-allowed",
              transition: "color 0.2s",
            }}
          >
            Go
          </button>
        </div>
      </form>

      {isFocused && !search && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderTop: "none",
          zIndex: 100,
        }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => { setSearch(s); submit(s); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                background: "transparent",
                border: "none",
                borderBottom: i < suggestions.length - 1 ? "1px solid var(--border-light)" : "none",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "1px",
                color: "var(--text-muted)",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
