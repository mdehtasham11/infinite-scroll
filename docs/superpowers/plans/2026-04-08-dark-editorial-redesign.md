# Dark Editorial Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current generic white/Inter/purple-gradient UI with a dark editorial photography-magazine aesthetic across all 9 components.

**Architecture:** CSS variables provide the design token layer; all components use inline styles + Tailwind layout utilities. Business logic (API calls, Redux, state) is untouched — only JSX structure and styles change. For ImageEditor, only the JSX return section (line 760 onward) is rewritten; all business logic functions above remain intact.

**Tech Stack:** React 19, Tailwind CSS 3, DM Mono + Cormorant Garamond (Google Fonts via @import), inline styles + CSS custom properties, react-icons

---

## File Map

| File | Change |
|------|--------|
| `src/index.css` | Full rewrite — tokens, fonts, utilities, scrollbar, keyframes |
| `src/App.css` | Clear entirely |
| `src/Components/navbar/Navbar.jsx` | Full rewrite |
| `src/Components/navbar/SearchBar.jsx` | Full rewrite |
| `src/Components/Home/Home.jsx` | Full rewrite |
| `src/Components/gallery/Gallery.jsx` | Full rewrite |
| `src/Components/footer/Footer.jsx` | Full rewrite |
| `src/Components/about/About.jsx` | Full rewrite |
| `src/Components/Image-to-Text/image.jsx` | Full rewrite |
| `src/Components/Image-to-Text/ImageEditor.jsx` | Rewrite JSX return only (line 760–end); keep all business logic above |

---

## Task 1: Global CSS — Design Tokens & Utilities

**Files:**
- Rewrite: `src/index.css`
- Clear: `src/App.css`

- [ ] **Step 1: Rewrite `src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg:           #0c0b09;
  --surface:      #141210;
  --surface-2:    #1a1714;
  --border:       #2a2420;
  --border-light: #1e1b18;
  --text:         #f5f0e8;
  --text-muted:   #7a6e64;
  --text-dim:     #3d3530;
  --gold:         #c9a84c;
  --gold-hover:   #e8c96a;
  --font-serif:   'Cormorant Garamond', Georgia, serif;
  --font-mono:    'DM Mono', monospace;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-mono);
  min-height: 100vh;
  line-height: 1.6;
}

.btn-gold {
  display: inline-block;
  padding: 10px 24px;
  border: 1px solid var(--gold);
  color: var(--gold);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
}
.btn-gold:hover { background: var(--gold); color: var(--bg); }

.btn-outline {
  display: inline-block;
  padding: 10px 24px;
  border: 1px solid var(--border);
  color: var(--text-muted);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  text-decoration: none;
}
.btn-outline:hover { border-color: var(--text-muted); color: var(--text); }

.label-mono {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--gold);
  display: block;
}

.serif-display {
  font-family: var(--font-serif);
  font-weight: 300;
  color: var(--text);
}

.gold-rule {
  height: 1px;
  background: var(--border);
  position: relative;
}
.gold-rule::after {
  content: '';
  position: absolute;
  left: 0; top: 0;
  width: 80px; height: 1px;
  background: var(--gold);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.animate-fadeInUp    { animation: fadeInUp 0.5s ease-out forwards; }
.animate-fadeInScale { animation: fadeInScale 0.4s ease-out forwards; }

::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: var(--surface); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 0; }
::-webkit-scrollbar-thumb:hover { background: var(--gold); }
```

- [ ] **Step 2: Clear `src/App.css`**

Replace entire contents with:
```css
/* intentionally empty */
```

- [ ] **Step 3: Start dev server and verify dark background loads**

```bash
npm run dev
```
Open http://localhost:5173. The page background should be near-black `#0c0b09`. If it's still white, hard-refresh (Ctrl+Shift+R).

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/App.css
git commit -m "style: replace global CSS with dark editorial design tokens"
```

---

## Task 2: Navbar

**Files:**
- Rewrite: `src/Components/navbar/Navbar.jsx`

- [ ] **Step 1: Rewrite `src/Components/navbar/Navbar.jsx`**

```jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { to: "/",       label: "Home",     end: true },
  { to: "/gallery", label: "Gallery"  },
  { to: "/image",   label: "Generate" },
  { to: "/editor",  label: "Edit"     },
  { to: "/about",   label: "About"    },
];

function Navbar() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle = (isActive) => ({
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: isActive ? "var(--gold)" : "var(--text-muted)",
    borderBottom: isActive ? "1px solid var(--gold)" : "1px solid transparent",
    paddingBottom: "2px",
    transition: "color 0.2s",
    textDecoration: "none",
  });

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(12,11,9,0.96)",
        backdropFilter: "blur(8px)",
        borderBottom: isScrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "border-color 0.3s",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>

            <NavLink to="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontStyle: "italic", color: "var(--text)" }}>
                Visual <span style={{ color: "var(--gold)" }}>Gallery</span>
              </span>
            </NavLink>

            <div className="hidden md:flex" style={{ gap: "32px" }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  style={({ isActive }) => linkStyle(isActive)}
                  onMouseEnter={(e) => { if (e.currentTarget.style.color !== "var(--gold)") e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { /* NavLink re-applies style on re-render */ }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {isOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => ({
                  display: "block",
                  padding: "14px 32px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: isActive ? "var(--gold)" : "var(--text-muted)",
                  borderBottom: "1px solid var(--border-light)",
                  textDecoration: "none",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
      <div style={{ height: "64px" }} />
    </>
  );
}

export default Navbar;
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:5173. Navbar should show: italic serif "Visual Gallery" (gold accent) left, DM Mono uppercase links right. Active link has gold underline. Scrolling adds a bottom border.

- [ ] **Step 3: Commit**

```bash
git add src/Components/navbar/Navbar.jsx
git commit -m "style: redesign navbar — editorial serif wordmark + DM Mono nav links"
```

---

## Task 3: SearchBar

**Files:**
- Rewrite: `src/Components/navbar/SearchBar.jsx`

- [ ] **Step 1: Rewrite `src/Components/navbar/SearchBar.jsx`**

```jsx
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

const SearchBar = () => {
  const [search, setSearch]     = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) dispatch(setSearchData(search.trim()));
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
          <div style={{ padding: "10px 14px", borderRight: "1px solid var(--border)", color: isFocused ? "var(--gold)" : "var(--text-muted)", display: "flex", alignItems: "center", transition: "color 0.2s" }}>
            <FaSearch size={12} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder="Search images..."
            style={{ flex: 1, padding: "10px 12px", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text)" }}
          />
          {search && (
            <button type="button" onClick={clearSearch} style={{ background: "transparent", border: "none", color: "var(--text-muted)", padding: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <FaTimes size={10} />
            </button>
          )}
          <button
            type="submit"
            disabled={!search.trim()}
            style={{ padding: "10px 16px", background: "transparent", border: "none", borderLeft: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: search.trim() ? "var(--gold)" : "var(--text-dim)", cursor: search.trim() ? "pointer" : "not-allowed", transition: "color 0.2s" }}
          >
            Go
          </button>
        </div>
      </form>

      {isFocused && !search && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--surface)", border: "1px solid var(--border)", borderTop: "none", zIndex: 100 }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => setSearch(s)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "transparent", border: "none", borderBottom: i < suggestions.length - 1 ? "1px solid var(--border-light)" : "none", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1px", color: "var(--text-muted)", cursor: "pointer", transition: "color 0.2s" }}
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
```

- [ ] **Step 2: Verify**

Navigate to `/gallery`. Search bar should appear flat/dark with 1px border. Focus should turn border gold. Suggestions list should appear on focus with thin dividers.

- [ ] **Step 3: Commit**

```bash
git add src/Components/navbar/SearchBar.jsx
git commit -m "style: redesign search bar — flat dark input with gold focus border"
```

---

## Task 4: Home Page

**Files:**
- Rewrite: `src/Components/Home/Home.jsx`

- [ ] **Step 1: Rewrite `src/Components/Home/Home.jsx`**

```jsx
import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../navbar/SearchBar";

const features = [
  { num: "01", title: "Infinite Gallery",   desc: "Browse thousands of high-quality images with infinite scroll through the Unsplash collection." },
  { num: "02", title: "AI Generation",      desc: "Create stunning images using advanced AI — describe your vision and watch it come to life." },
  { num: "03", title: "AI Image Editing",   desc: "Upload and transform your images with powerful AI editing tools powered by Flux Kontext." },
  { num: "04", title: "Curated Collection", desc: "Discover handpicked images from talented creators worldwide, updated continuously." },
];

const stats = [
  { number: "10M+",  label: "Images Served" },
  { number: "2M+",   label: "Downloads"     },
  { number: "500K+", label: "Favorites"     },
  { number: "100K+", label: "Images"        },
];

const featuredImages = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",  title: "Mountain Majesty", span: true },
  { url: "https://images.unsplash.com/photo-1741524915320-8fee76e41424?w=400&auto=format&fit=crop&q=80",  title: "Sunset Dreams" },
  { url: "https://images.unsplash.com/photo-1741017269648-44a2497aba20?w=400&auto=format&fit=crop&q=80",  title: "Urban Poetry" },
  { url: "https://images.unsplash.com/photo-1616939750001-566f1e189f2c?w=400&auto=format&fit=crop&q=80",  title: "Nature's Canvas" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=80&crop=bottom", title: "Lake Reflection" },
];

const Home = () => (
  <div style={{ background: "var(--bg)" }}>

    {/* ── Hero ── */}
    <section style={{ padding: "72px 48px 64px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "24px" }}>Issue 001 — Photography · 2026</div>
        <h1 className="serif-display" style={{ fontSize: "clamp(56px, 8vw, 96px)", lineHeight: 0.88, marginBottom: "24px" }}>
          Discover<br />
          <em style={{ color: "var(--gold)" }}>Visual</em><br />
          Stories
        </h1>
        <div className="gold-rule" style={{ marginBottom: "20px" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "32px" }}>
          Explore the world through a lens
        </p>
        <SearchBar />
        <div style={{ display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
          <Link to="/gallery"><button className="btn-gold">Explore Gallery</button></Link>
          <Link to="/image"><button className="btn-outline">Generate AI Images</button></Link>
          <Link to="/editor"><button className="btn-outline">Edit Images</button></Link>
        </div>
      </div>
    </section>

    {/* ── Scroll indicator ── */}
    <div style={{ textAlign: "center", padding: "12px", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--text-dim)", textTransform: "uppercase" }}>↓ scroll</span>
    </div>

    {/* ── Featured Images ── */}
    <section style={{ padding: "48px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <h2 className="serif-display" style={{ fontSize: "32px" }}>Featured</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "2px" }}>04 images</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "180px 180px", gap: "3px" }}>
          {featuredImages.map((img, i) => (
            <div key={i} style={{ gridRow: img.span ? "span 2" : "auto", position: "relative", overflow: "hidden", background: "var(--surface-2)" }}>
              <img
                src={img.url} alt={img.title} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, transition: "opacity 0.3s, transform 0.5s", display: "block" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.transform = "scale(1)"; }}
              />
              <div style={{ position: "absolute", bottom: "8px", left: "10px", fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "2px", color: "rgba(245,240,232,0.5)", textTransform: "uppercase" }}>
                {img.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features — numbered list ── */}
    <section style={{ padding: "48px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "32px" }}>Capabilities</div>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: "32px", alignItems: "flex-start", padding: "28px 0", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "40px", color: "var(--gold)", opacity: 0.4, lineHeight: 1, minWidth: "60px" }}>{f.num}</div>
            <div>
              <h3 className="serif-display" style={{ fontSize: "24px", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.8, maxWidth: "480px" }}>{f.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>
    </section>

    {/* ── Stats ── */}
    <section style={{ padding: "64px 48px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "40px" }}>By the numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "0 32px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
              <div className="serif-display" style={{ fontSize: "56px", lineHeight: 1, color: "var(--gold)", marginBottom: "8px" }}>{s.number}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section style={{ padding: "72px 48px", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 className="serif-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontStyle: "italic", marginBottom: "16px" }}>
          Ready to <span style={{ color: "var(--gold)" }}>Explore?</span>
        </h2>
        <div className="gold-rule" style={{ marginBottom: "24px", maxWidth: "320px" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.8, maxWidth: "480px", marginBottom: "32px" }}>
          Dive into our vast collection or create your own AI-generated masterpieces. The world of visual creativity awaits.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link to="/gallery"><button className="btn-gold">Start Exploring</button></Link>
          <Link to="/about"><button className="btn-outline">Learn More</button></Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
```

- [ ] **Step 2: Verify at http://localhost:5173/**

Hero shows large 3-line serif heading, gold italic "Visual", gold rule, flat search bar. Featured images in 2+3 asymmetric grid. Numbered features list. Large gold stat numbers. Dark CTA.

- [ ] **Step 3: Commit**

```bash
git add src/Components/Home/Home.jsx
git commit -m "style: redesign home page — editorial hero, numbered features, gold stats"
```

---

## Task 5: Gallery Page

**Files:**
- Rewrite: `src/Components/gallery/Gallery.jsx`

- [ ] **Step 1: Rewrite `src/Components/gallery/Gallery.jsx`**

```jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SearchBar from "../navbar/SearchBar";
import { FaHeart, FaDownload, FaExpand } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import throttle from "lodash/throttle";

function GalleryCard({ image, liked, onLike, onDownload }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: "relative", breakInside: "avoid", marginBottom: "3px", overflow: "hidden", outline: hovered ? "1px solid var(--gold)" : "1px solid transparent", transition: "outline-color 0.2s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image.urls.regular}
        alt={image.alt_description || "Image"}
        loading="lazy"
        style={{ width: "100%", height: "auto", display: "block", opacity: hovered ? 1 : 0.9, transition: "opacity 0.3s" }}
      />
      {hovered && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,0.75) 0%, transparent 55%)" }} />
          {image.user && (
            <div style={{ position: "absolute", bottom: "8px", left: "10px", fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "1px", color: "rgba(245,240,232,0.55)", textTransform: "uppercase" }}>
              {image.user.name}
            </div>
          )}
          <div style={{ position: "absolute", top: "6px", right: "6px", display: "flex", flexDirection: "column", gap: "3px" }}>
            <button onClick={onLike} style={{ width: "26px", height: "26px", background: liked ? "var(--gold)" : "rgba(12,11,9,0.85)", border: `1px solid ${liked ? "var(--gold)" : "var(--border)"}`, color: liked ? "var(--bg)" : "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "10px" }}>
              {liked ? <FaHeart /> : <CiHeart />}
            </button>
            <button onClick={onDownload} style={{ width: "26px", height: "26px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "10px" }}>
              <FaDownload />
            </button>
            <button onClick={() => window.open(image.urls.full, "_blank")} style={{ width: "26px", height: "26px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "10px" }}>
              <FaExpand />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Gallery() {
  const searchData  = useSelector((state) => state.search.searchData);
  const [images, setImages]       = useState([]);
  const [page, setPage]           = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [likedImages, setLikedImages] = useState(new Set());
  const ACCESS_KEY = "pPAAKdRDW1Bdnbb8JSuudEmMxxi5KGu2EucdXqEDNW8";

  const handleLike = (id) =>
    setLikedImages((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const fetchImages = async (pg) => {
    setIsLoading(true);
    try {
      const url = searchData
        ? `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&per_page=12&query=${searchData}&page=${pg}`
        : `https://api.unsplash.com/photos/?client_id=${ACCESS_KEY}&per_page=16&page=${pg}`;
      const { data } = await axios.get(url);
      const incoming = searchData ? data.results : data;
      setImages((prev) => [...prev, ...incoming.filter((img) => !prev.some((p) => p.id === img.id))]);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { setImages([]); setPage(1); }, [searchData]);
  useEffect(() => { fetchImages(page); }, [page]);

  const handleScroll = useCallback(
    throttle(() => { if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200) setPage((p) => p + 1); }, 1000),
    []
  );
  useEffect(() => { window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll); }, [handleScroll]);

  const downloadImage = async (url, filename) => {
    try {
      const blob = await (await fetch(url)).blob();
      const a = Object.assign(document.createElement("a"), { href: window.URL.createObjectURL(blob), download: filename });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="label-mono" style={{ marginBottom: "6px" }}>Browse Collection</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "32px", color: "var(--text)" }}>Image Gallery</h1>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "2px" }}>{images.length} images loaded</div>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 32px", borderBottom: "1px solid var(--border)" }}>
        <SearchBar />
        {searchData && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", marginTop: "10px" }}>
            Results for <span style={{ color: "var(--gold)" }}>"{searchData}"</span>
          </p>
        )}
      </div>

      {/* Grid */}
      <div style={{ padding: "3px" }}>
        {images.length === 0 && !isLoading ? (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "48px", color: "var(--text-dim)", marginBottom: "16px" }}>✦</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "24px", color: "var(--text-muted)", marginBottom: "8px" }}>No Images Found</h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-dim)", letterSpacing: "1px" }}>Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5" style={{ columnGap: "3px" }}>
            {images.map((image) => (
              <GalleryCard
                key={image.id}
                image={image}
                liked={likedImages.has(image.id)}
                onLike={() => handleLike(image.id)}
                onDownload={() => downloadImage(image.urls.full, `image-${image.id}.jpg`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px", gap: "12px" }}>
          <div style={{ width: "28px", height: "28px", border: "1px solid var(--border)", borderTop: "1px solid var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase" }}>Loading</span>
        </div>
      )}
    </div>
  );
}

export default Gallery;
```

- [ ] **Step 2: Verify at http://localhost:5173/gallery**

Compact header (no hero), flat dark search bar below it, masonry grid on dark background. Hover on image shows gold outline + action buttons. Loading spinner is gold.

- [ ] **Step 3: Commit**

```bash
git add src/Components/gallery/Gallery.jsx
git commit -m "style: redesign gallery — compact header, dark masonry with gold hover borders"
```

---

## Task 6: Footer

**Files:**
- Rewrite: `src/Components/footer/Footer.jsx`

- [ ] **Step 1: Rewrite `src/Components/footer/Footer.jsx`**

```jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const quickLinks = [
  { name: "Home",           path: "/" },
  { name: "Gallery",        path: "/gallery" },
  { name: "Generate Images",path: "/image" },
  { name: "Edit Images",    path: "/editor" },
  { name: "About",          path: "/about" },
];

const socialLinks = [
  { icon: <FaTwitter size={12} />,   label: "Twitter",   href: "#" },
  { icon: <FaInstagram size={12} />, label: "Instagram", href: "#" },
  { icon: <FaLinkedin size={12} />,  label: "LinkedIn",  href: "#" },
  { icon: <FaGithub size={12} />,    label: "GitHub",    href: "#" },
];

function SocialBtn({ icon, label, href }) {
  return (
    <a href={href} aria-label={label}
      style={{ width: "30px", height: "30px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >{icon}</a>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "48px 48px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px" }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "22px", color: "var(--text)", marginBottom: "12px" }}>
              Visual <span style={{ color: "var(--gold)" }}>Gallery</span>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 2, maxWidth: "280px", marginBottom: "20px" }}>
              Empowering creativity through AI-powered visual content. Discover, create, and share stunning images with our global community.
            </p>
            <div style={{ display: "flex" }}>
              <input type="email" placeholder="your@email.com"
                style={{ flex: 1, maxWidth: "200px", padding: "8px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRight: "none", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text)", outline: "none" }}
              />
              <button className="btn-gold" style={{ padding: "8px 16px", fontSize: "8px" }}>Subscribe</button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>Navigation</div>
            {quickLinks.map((l) => (
              <Link key={l.path} to={l.path}
                style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", textDecoration: "none", letterSpacing: "1px", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >{l.name}</Link>
            ))}
          </div>

          {/* Connect */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>Connect</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {socialLinks.map((s) => <SocialBtn key={s.label} {...s} />)}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 2 }}>
              hello@visualgallery.com<br />support@visualgallery.com
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)", marginTop: "40px", padding: "14px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-dim)", letterSpacing: "1px" }}>
          © {year} <span style={{ color: "var(--gold)" }}>Visual Gallery</span> — All rights reserved
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
            <a key={l} href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "1px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
```

- [ ] **Step 2: Verify**

Footer: 3-column grid, italic serif brand, gold column headers, flat social icon buttons with gold hover, thin top border. Bottom bar with copyright.

- [ ] **Step 3: Commit**

```bash
git add src/Components/footer/Footer.jsx
git commit -m "style: redesign footer — editorial 3-column colophon"
```

---

## Task 7: About Page

**Files:**
- Rewrite: `src/Components/about/About.jsx`

- [ ] **Step 1: Rewrite `src/Components/about/About.jsx`**

```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const features = [
  { num: "01", title: "Curated Photography",  desc: "Access to millions of high-quality images from talented photographers worldwide through the Unsplash API." },
  { num: "02", title: "AI Image Generation",  desc: "Create stunning, unique images using cutting-edge Flux AI technology from Nebius." },
  { num: "03", title: "Global Community",     desc: "Join a worldwide community of creators, artists, and visual storytellers." },
  { num: "04", title: "Innovative Technology",desc: "Built with React, Redux, and the latest AI APIs for optimal performance and user experience." },
];

const stats = [
  { number: "10M+",  label: "Images Served" },
  { number: "500K+", label: "Happy Users"   },
  { number: "50+",   label: "Countries"     },
  { number: "99.9%", label: "Uptime"        },
];

const team = [
  { name: "Sarah Johnson",   role: "Lead Designer",        image: "https://images.unsplash.com/photo-1494790108755-2616b612c5d3?w=400&h=400&fit=crop&crop=face" },
  { name: "Michael Chen",    role: "Full Stack Developer",  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { name: "Emily Rodriguez", role: "AI Specialist",         image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
];

const values = [
  { title: "Creativity First",  desc: "We believe creativity is the heart of human expression. Every feature is designed to empower and inspire creative minds." },
  { title: "Community Driven",  desc: "Our platform thrives because of our amazing community. We listen, learn, and evolve based on user feedback and needs." },
  { title: "Innovation",        desc: "We embrace cutting-edge technology and innovative solutions to create experiences that push boundaries." },
  { title: "Accessibility",     desc: "Beautiful visual content should be accessible to everyone, regardless of location, background, or technical expertise." },
];

function TeamCard({ member }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ border: `1px solid ${hovered ? "var(--gold)" : "var(--border)"}`, background: "var(--surface-2)", padding: "24px", transition: "border-color 0.2s", textAlign: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: "80px", height: "80px", margin: "0 auto 16px", overflow: "hidden", border: "1px solid var(--border)" }}>
        <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%)" }} />
      </div>
      <h3 className="serif-display" style={{ fontSize: "20px", marginBottom: "4px" }}>{member.name}</h3>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>{member.role}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        {[<FaGithub size={11} key="gh" />, <FaLinkedin size={11} key="li" />, <FaTwitter size={11} key="tw" />].map((icon, i) => (
          <a key={i} href="#"
            style={{ width: "26px", height: "26px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >{icon}</a>
        ))}
      </div>
    </div>
  );
}

const About = () => (
  <div style={{ background: "var(--bg)" }}>

    {/* Hero */}
    <section style={{ padding: "72px 48px 64px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "24px" }}>About — Visual Gallery</div>
        <h1 className="serif-display" style={{ fontSize: "clamp(48px, 7vw, 80px)", lineHeight: 0.9, marginBottom: "24px" }}>
          Empowering<br /><em style={{ color: "var(--gold)" }}>Creative</em><br />Minds
        </h1>
        <div className="gold-rule" style={{ marginBottom: "20px" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.9, maxWidth: "560px" }}>
          We're passionate about making visual content accessible, beautiful, and inspiring for everyone. Combining the best of human creativity with cutting-edge AI technology.
        </p>
      </div>
    </section>

    {/* Features numbered */}
    <section style={{ padding: "48px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "32px" }}>What We Offer</div>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: "32px", alignItems: "flex-start", padding: "28px 0", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "40px", color: "var(--gold)", opacity: 0.4, lineHeight: 1, minWidth: "60px" }}>{f.num}</div>
            <div>
              <h3 className="serif-display" style={{ fontSize: "24px", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.8, maxWidth: "480px" }}>{f.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>
    </section>

    {/* Stats */}
    <section style={{ padding: "64px 48px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "40px" }}>Our Impact</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "0 32px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
              <div className="serif-display" style={{ fontSize: "56px", lineHeight: 1, color: "var(--gold)", marginBottom: "8px" }}>{s.number}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section style={{ padding: "48px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "32px" }}>The Team</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {team.map((member, i) => <TeamCard key={i} member={member} />)}
        </div>
      </div>
    </section>

    {/* Values */}
    <section style={{ padding: "48px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "32px" }}>Our Values</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {values.map((v, i) => (
            <div key={i} style={{ padding: "28px", paddingLeft: i % 2 === 1 ? "32px" : "0", paddingRight: i % 2 === 0 ? "32px" : "0", borderTop: "1px solid var(--border)", borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none" }}>
              <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "16px" }}>
                <h3 className="serif-display" style={{ fontSize: "22px", marginBottom: "8px" }}>{v.title}</h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 1.9 }}>{v.desc}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", gridColumn: "span 2" }} />
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "72px 48px", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 className="serif-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontStyle: "italic", marginBottom: "16px" }}>
          Ready to Join Our <span style={{ color: "var(--gold)" }}>Journey?</span>
        </h2>
        <div className="gold-rule" style={{ marginBottom: "24px", maxWidth: "280px" }} />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link to="/gallery"><button className="btn-gold">Explore Gallery</button></Link>
          <Link to="/image"><button className="btn-outline">Try AI Generation</button></Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;
```

- [ ] **Step 2: Verify at http://localhost:5173/about**

Editorial hero, numbered features list, large gold stats, team cards with grayscale portraits and gold hover border, 2-column values with gold left bar, dark CTA.

- [ ] **Step 3: Commit**

```bash
git add src/Components/about/About.jsx
git commit -m "style: redesign about page — editorial dark treatment throughout"
```

---

## Task 8: Image Generator

**Files:**
- Rewrite: `src/Components/Image-to-Text/image.jsx`

- [ ] **Step 1: Rewrite `src/Components/Image-to-Text/image.jsx`**

Keep all imports and the `openai` client initialization exactly as-is. Replace only the component body JSX.

```jsx
import React, { useState } from "react";
import { FaDownload, FaExpand } from "react-icons/fa";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNDM4MjE5NzY1NzY5ODQ1MDg5MyIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTg5OTgzODMyNiwidXVpZCI6IjViZTM4ZDFkLTRlYjMtNGRjNy1hNTRmLWNjMzlkZGNlMmVmNCIsIm5hbWUiOiJpbWFnZS1nZW5lcmF0aW9uIiwiZXhwaXJlc19hdCI6IjIwMzAtMDMtMTVUMjA6NTI6MDYrMDAwMCJ9.io4jLb7ff3y5OXmNadeU9WKg66Aejr9DMn9N-tCeZHU",
  dangerouslyAllowBrowser: true,
});

const suggestions = [
  "A futuristic cityscape at sunset",
  "Magical forest with glowing mushrooms",
  "Abstract painting in vibrant colors",
  "Serene mountain lake reflection",
  "Cyberpunk street scene at night",
];

function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [history, setHistory]   = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError(""); setImageUrl(""); setLoading(true);
    try {
      const response = await openai.images.generate({ model: "black-forest-labs/flux-schnell", prompt: text, n: 1, size: "1024x1024" });
      const url = response.data?.[0]?.url;
      if (!url) throw new Error("No image URL returned");
      setImageUrl(url);
      setHistory((prev) => [{ prompt: text, imageUrl: url, timestamp: new Date() }, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try again.");
    } finally { setLoading(false); }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const a = Object.assign(document.createElement("a"), { href: window.URL.createObjectURL(blob), download: `ai-generated-${Date.now()}.jpg` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    } catch (err) { console.error(err); }
  };

  const lbl = { fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "10px", display: "block" };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "28px", color: "var(--text)" }}>AI Generator</h1>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)" }}>FLUX · NEBIUS</span>
      </div>

      {/* 2-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 65px)" }}>

        {/* Sidebar */}
        <div style={{ borderRight: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <form onSubmit={handleSubmit}>
            <label style={lbl}>Prompt</label>
            <textarea
              value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Describe your image..." rows={5}
              style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.5px", lineHeight: 1.7, padding: "10px", resize: "none", outline: "none", marginBottom: "12px", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button type="submit" disabled={loading || !text.trim()} className="btn-gold" style={{ width: "100%", opacity: loading || !text.trim() ? 0.5 : 1, cursor: loading || !text.trim() ? "not-allowed" : "pointer" }}>
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </form>

          {error && (
            <div style={{ border: "1px solid #5a2020", background: "#1a0a0a", padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "#c47070", letterSpacing: "0.5px" }}>{error}</div>
          )}

          <div>
            <label style={lbl}>Suggestions</label>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setText(s)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--border-light)", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", cursor: "pointer", letterSpacing: "0.5px", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >{s}</button>
            ))}
          </div>

          {history.length > 0 && (
            <div>
              <label style={lbl}>Recent</label>
              {history.slice(0, 3).map((item, i) => (
                <div key={i} onClick={() => { setText(item.prompt); setImageUrl(item.imageUrl); }}
                  style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                >
                  <img src={item.imageUrl} alt="" style={{ width: "36px", height: "36px", objectFit: "cover" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.5px" }}>{item.prompt}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: "400px" }}>
            {loading ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "32px", height: "32px", border: "1px solid var(--border)", borderTop: "1px solid var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase" }}>Generating</div>
              </div>
            ) : imageUrl ? (
              <>
                <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain", display: "block" }} />
                <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <button onClick={downloadImage} title="Download" style={{ width: "28px", height: "28px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "11px" }}><FaDownload /></button>
                  <button onClick={() => window.open(imageUrl, "_blank")} title="Full size" style={{ width: "28px", height: "28px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "11px" }}><FaExpand /></button>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "rgba(12,11,9,0.8)", backdropFilter: "blur(4px)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "48px", color: "var(--text-dim)", marginBottom: "12px" }}>✦</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--text-dim)", textTransform: "uppercase" }}>Awaiting prompt</div>
              </div>
            )}
          </div>

          {imageUrl && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "12px" }}>
              {[["1024×1024", "Resolution"], ["Flux Schnell", "Model"], ["AI Generated", "Type"]].map(([val, lbl]) => (
                <div key={lbl} style={{ border: "1px solid var(--border)", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text)", marginBottom: "4px" }}>{val}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>{lbl}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
```

- [ ] **Step 2: Verify at http://localhost:5173/image**

Compact dark header, 2-column layout: dark sidebar with DM Mono prompt textarea + gold generate button + suggestion list; canvas area with dark empty state. All API functionality intact.

- [ ] **Step 3: Commit**

```bash
git add "src/Components/Image-to-Text/image.jsx"
git commit -m "style: redesign AI generator — clean dark 2-column tool layout"
```

---

## Task 9: Image Editor

**Files:**
- Partial rewrite: `src/Components/Image-to-Text/ImageEditor.jsx` — **only the JSX return statement (line 760 onward)**. All business logic above line 760 is kept exactly as-is.

- [ ] **Step 1: Replace only the JSX return in `ImageEditor.jsx`**

Find the line `return (` that begins the JSX (around line 760) and replace everything from that line to end-of-file with:

```jsx
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "28px", color: "var(--text)" }}>Image Editor</h1>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)" }}>FLUX KONTEXT · BFL</span>
      </div>

      {!uploadedImage ? (
        /* ── Upload screen ── */
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 65px)", padding: "32px" }}>
          <div style={{ textAlign: "center", maxWidth: "480px", width: "100%" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "64px", color: "var(--text-dim)", marginBottom: "16px" }}>↑</div>
            <h2 className="serif-display" style={{ fontSize: "28px", marginBottom: "8px" }}>Upload Your Image</h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", lineHeight: 1.9, marginBottom: "24px" }}>
              Choose an image to start editing with AI-powered tools
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()} className="btn-gold" style={{ marginBottom: "12px" }}>
              Choose Image
            </button>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-dim)", letterSpacing: "1px", marginTop: "12px" }}>
              JPG · PNG · GIF · WEBP
            </div>
            {error && (
              <div style={{ marginTop: "16px", border: "1px solid #5a2020", background: "#1a0a0a", padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "#c47070" }}>{error}</div>
            )}
          </div>
        </div>
      ) : (
        /* ── Editing interface ── */
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 65px)" }}>

          {/* ── Left panel — tools ── */}
          <div style={{ borderRight: "1px solid var(--border)", overflowY: "auto", display: "flex", flexDirection: "column" }}>

            {/* Controls: undo/redo + model + custom prompt */}
            <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>Controls</div>

              {/* Undo / Redo */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {[
                  { label: "Undo", action: handleUndo, disabled: currentEditIndex <= 0 },
                  { label: "Redo", action: handleRedo, disabled: currentEditIndex >= editHistory.length - 1 },
                ].map(({ label, action, disabled }) => (
                  <button key={label} onClick={action} disabled={disabled}
                    style={{ flex: 1, padding: "7px", background: "transparent", border: `1px solid ${disabled ? "var(--border-light)" : "var(--border)"}`, fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", color: disabled ? "var(--text-dim)" : "var(--text-muted)", cursor: disabled ? "not-allowed" : "pointer", transition: "color 0.2s, border-color 0.2s" }}
                    onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--text-muted)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = disabled ? "var(--text-dim)" : "var(--text-muted)"; e.currentTarget.style.borderColor = disabled ? "var(--border-light)" : "var(--border)"; }}
                  >{label}</button>
                ))}
              </div>

              {/* Model selector */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>AI Model</div>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
                  style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "9px", padding: "8px", outline: "none", cursor: "pointer" }}
                >
                  {aiModels.map((model) => (
                    <option key={model.id} value={model.id} style={{ background: "var(--surface-2)" }}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "7px", color: "var(--text-dim)" }}>Speed: {aiModels.find((m) => m.id === selectedModel)?.speed}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "7px", color: "var(--text-dim)" }}>Quality: {aiModels.find((m) => m.id === selectedModel)?.quality}</span>
                </div>
              </div>

              {/* Custom edit prompt */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>Custom Edit</div>
              <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder="e.g., Change the car color to red..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCustomEdit()}
                  style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "8px", padding: "7px 8px", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button onClick={handleCustomEdit} disabled={!editPrompt.trim() || loading}
                  style={{ padding: "7px 12px", background: "transparent", border: `1px solid ${!editPrompt.trim() || loading ? "var(--border-light)" : "var(--gold)"}`, fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1px", color: !editPrompt.trim() || loading ? "var(--text-dim)" : "var(--gold)", cursor: !editPrompt.trim() || loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                >Edit</button>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                <button onClick={() => downloadImage(editedImage || uploadedImage, "edited-image.jpg")} className="btn-gold" style={{ width: "100%" }}>Download Image</button>
                <button onClick={resetEditor} className="btn-outline" style={{ width: "100%" }}>Start Over</button>
              </div>
            </div>

            {/* Quick edit options */}
            <div style={{ padding: "20px", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>Edit Options</div>
              {editingOptions.map((option) => (
                <div key={option.id} style={{ marginBottom: "16px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px", paddingBottom: "6px", borderBottom: "1px solid var(--border-light)" }}>
                    {option.title}
                  </div>
                  {option.prompts.map((prompt, index) => (
                    <button key={index} onClick={() => generateEditedImage(prompt)} disabled={loading}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--border-light)", fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-muted)", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.5px", lineHeight: 1.5, transition: "color 0.2s" }}
                      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.color = "var(--gold)"; }}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >{prompt}</button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel — image display ── */}
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              {/* Original */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Original</div>
                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", aspectRatio: "1", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={uploadedImage} alt="Original" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>

              {/* Edited */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                  {loading ? "Processing..." : "Edited"}
                </div>
                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", aspectRatio: "1", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {loading ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: "28px", height: "28px", border: "1px solid var(--border)", borderTop: "1px solid var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 10px" }} />
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>Working</div>
                    </div>
                  ) : editedImage ? (
                    <img src={editedImage} alt="Edited" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center", padding: "16px" }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "32px", color: "var(--text-dim)", marginBottom: "8px" }}>✦</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1px", color: "var(--text-dim)", textTransform: "uppercase" }}>Choose an option</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            {editedImage && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {[
                  ["1024×1024", "Resolution"],
                  [editHistory[currentEditIndex]?.method || "AI", "Method"],
                  [aiModels.find((m) => m.id === selectedModel)?.name || "Flux", "Model"],
                  ["High Quality", "Output"],
                ].map(([val, lbl]) => (
                  <div key={lbl} style={{ border: "1px solid var(--border)", padding: "10px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text)", marginBottom: "3px" }}>{val}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit history */}
            {editHistory.length > 1 && (
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px" }}>History</div>
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                  {editHistory.map((item, index) => (
                    <button key={index}
                      onClick={() => { setCurrentEditIndex(index); setEditedImage(item.edited); }}
                      style={{ flexShrink: 0, width: "56px", height: "56px", overflow: "hidden", border: `1px solid ${index === currentEditIndex ? "var(--gold)" : "var(--border)"}`, background: "var(--surface-2)", padding: 0, cursor: "pointer", transition: "border-color 0.2s" }}
                    >
                      <img src={item.edited || item.original} alt={`Edit ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ border: "1px solid #5a2020", background: "#1a0a0a", padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "#c47070", letterSpacing: "0.5px", lineHeight: 1.6 }}>{error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageEditor;
```

- [ ] **Step 2: Verify at http://localhost:5173/editor**

Upload screen: centered dark with italic arrow, gold "Choose Image" button. After upload: 2-column layout — left panel has dark controls/tool list, right has side-by-side Original/Edited images. All editing functionality works (undo/redo, quick prompts, custom prompt, download, reset).

- [ ] **Step 3: Commit**

```bash
git add "src/Components/Image-to-Text/ImageEditor.jsx"
git commit -m "style: redesign image editor — clean dark 2-column tool layout"
```

---

## Task 10: Final verification

- [ ] **Step 1: Run full dev build to check for errors**

```bash
npm run build
```
Expected: build succeeds with no errors.

- [ ] **Step 2: Smoke test all routes**

Visit each route and verify no white backgrounds, no Inter font, no blue/purple gradients remain:
- http://localhost:5173/ — Home editorial hero
- http://localhost:5173/gallery — dark masonry gallery
- http://localhost:5173/image — AI generator tool
- http://localhost:5173/editor — AI editor tool
- http://localhost:5173/about — editorial about page

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "style: complete Dark Editorial redesign — all components"
```
