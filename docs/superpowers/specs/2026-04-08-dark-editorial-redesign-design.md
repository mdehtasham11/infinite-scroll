# Dark Editorial — Full App Redesign

**Date:** 2026-04-08  
**Scope:** Full visual identity redesign across all components  
**Aesthetic:** Dark Editorial / High-end Photography Magazine

---

## 1. Design Direction

The app is redesigned as a high-end photography magazine publication. The images are the art — the UI is their frame. Every design choice serves this hierarchy: near-black backgrounds recede, warm amber gold guides the eye, and elegant serif typography creates editorial gravitas without competing with the photographs.

**Key principles:**
- No border-radius (sharp edges throughout — images included stay as-is via CSS `object-fit`)
- Thin 1px borders do all structural work; no box-shadows
- Gold accent is used sparingly — active states, dividers, CTAs only
- DM Mono for all UI chrome (labels, nav, metadata, buttons)
- Cormorant Garamond for all editorial text (headings, brand, body copy)
- Whitespace is generous; density only in the gallery grid itself

---

## 2. Design Tokens

All tokens go into `src/index.css` as CSS custom properties.

```css
--bg:            #0c0b09;   /* page background */
--surface:       #141210;   /* card / panel backgrounds */
--surface-2:     #1a1714;   /* nested surfaces */
--border:        #2a2420;   /* primary border */
--border-light:  #1e1b18;   /* subtle inner border */
--text:          #f5f0e8;   /* primary text */
--text-muted:    #7a6e64;   /* secondary / placeholder text */
--text-dim:      #3d3530;   /* very muted / disabled */
--gold:          #c9a84c;   /* accent — active, CTAs, rules */
--gold-hover:    #e8c96a;   /* gold hover state */
--font-serif:    'Cormorant Garamond', Georgia, serif;
--font-mono:     'DM Mono', monospace;
```

**Google Fonts import** (added to `index.css`):
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
```

---

## 3. Global CSS (`src/index.css`)

Replace current content entirely:

- Import Google Fonts at top
- Set CSS variables on `:root`
- `body`: `background: var(--bg)`, `color: var(--text)`, `font-family: var(--font-mono)`
- `html`: `scroll-behavior: smooth`
- Remove all existing `.btn-primary`, `.btn-secondary`, `.card`, `.card-gradient`, `.glass`, `.text-gradient` utility classes — replace with editorial equivalents
- New utility classes:
  - `.btn-gold` — 1px solid gold border, gold text, transparent bg, DM Mono uppercase, no border-radius
  - `.btn-outline` — 1px solid `var(--border)`, muted text, same structure
  - `.label-mono` — DM Mono 9px, letter-spacing 3px, uppercase, gold color
  - `.rule-gold` — 1px border-bottom gold, with gradient fade to transparent
  - `.serif-display` — Cormorant Garamond 300, large size
- Keyframes: keep `fadeInUp`, `fadeInScale`; remove float, pulse-slow, shimmer
- Custom scrollbar: dark track `#141210`, gold thumb

---

## 4. Navbar (`src/Components/navbar/Navbar.jsx`)

**Layout:** fixed top, full-width, flex row, space-between.

**Left — Wordmark:**
- `<span>` in Cormorant Garamond italic, `font-size: 20px`
- Text: italic "Visual" (var(--text)) + " Gallery" in var(--gold)
- No logo image (remove `download.png` import)

**Right — Nav links:**
- DM Mono, `font-size: 9px`, `letter-spacing: 3px`, `text-transform: uppercase`
- Default color: `var(--text-muted)`
- Hover: `var(--text)` with transition
- Active (`isActive`): `var(--gold)` + `border-bottom: 1px solid var(--gold)`
- Gap between links: `32px`

**Background:**
- Default (top): `background: var(--bg)`, no border
- Scrolled: add `border-bottom: 1px solid var(--border)`
- Always: `backdrop-filter: blur(8px)` — subtle, not glassy

**Mobile:**
- Hamburger button: 1px solid `var(--border)` square button, no border-radius
- Mobile menu: full-width panel below navbar, `background: var(--surface)`, `border-bottom: 1px solid var(--border)`
- Links stacked, same DM Mono style, `border-bottom: 1px solid var(--border-light)` between items

---

## 5. Home Page (`src/Components/Home/Home.jsx`)

### 5a. Hero Section
- Full-width, `background: var(--bg)`, `padding: 64px 48px`
- **Issue label** (top): DM Mono 9px, gold, letter-spacing 4px — "ISSUE 001 — PHOTOGRAPHY · 2026"
- **Headline**: Cormorant Garamond 300, `font-size: clamp(56px, 8vw, 96px)`, `line-height: 0.88`, left-aligned
  - Line 1: "Discover" — `var(--text)`
  - Line 2: "Visual" italic — `var(--gold)`
  - Line 3: "Stories" — `var(--text)`
- **Gold rule**: 1px `var(--border)` full-width, with 80px gold left segment (`::after`)
- **Sub-label**: DM Mono 10px, muted, letter-spacing 2px, uppercase — "Explore the world through a lens"
- **SearchBar**: displayed inline here (see §8)
- **CTA buttons**: two flat buttons — `.btn-gold` "Explore Gallery" + `.btn-outline` "Generate AI Images"

### 5b. Featured Images
- Section header: flex row — Cormorant 300 28px "Featured" left + DM Mono muted count right
- Grid: CSS grid `2fr 1fr 1fr`, 2 rows, 3px gap. First cell spans 2 rows (tall image)
- Images: `object-fit: cover`, no border-radius, `opacity: 0.85`, hover `opacity: 1`
- Hover: thin gold border appears (`outline: 1px solid var(--gold)`)
- Caption overlay: bottom-left, DM Mono 7px, letter-spacing 2px, muted

### 5c. Features Section
- Background: `var(--surface)`, full-width
- Numbered list layout — each item: large gold number left (DM Mono 48px "01"), title + description right
- Thin `1px solid var(--border)` top border between items
- No cards, no icons, no border-radius — pure typographic layout

### 5d. Stats Section
- Background: `var(--bg)`
- 4 columns: each has a large Cormorant 300 number (60px) above a DM Mono muted label
- Thin gold vertical dividers between columns (1px)

### 5e. CTA Section
- Background: `var(--surface)`
- Cormorant 300 italic heading: "Ready to Explore?"
- Thin gold rule below heading
- Two buttons side by side

---

## 6. Gallery (`src/Components/gallery/Gallery.jsx`)

**Remove:** the large black hero header section entirely.

**Replace with compact header bar:**
- Flex row, space-between, `padding: 24px 32px`, `border-bottom: 1px solid var(--border)`
- Left: DM Mono gold label "Browse Collection" above + Cormorant italic "Image Gallery" heading
- Right: DM Mono muted — "{images.length} images loaded"

**Search bar** rendered directly below header bar in its own `padding: 16px 32px` row with bottom border.

**Masonry grid:**
- `columns: 1 sm:2 md:3 lg:4 xl:5`, `gap: 3px` (tighter than before)
- Cards: `break-inside-avoid`, NO `border-radius`, NO `box-shadow`
- Hover state:
  - `outline: 1px solid var(--gold)` (not border — outline doesn't shift layout)
  - Action buttons (like/download/expand) appear: small `24px × 24px` dark square buttons, gold icon color, positioned top-right
  - Warm dark overlay from bottom with DM Mono caption (author name, 8px)
- Like button: filled gold icon when liked (`var(--gold)`)
- Loading spinner: replace blue spinner with DM Mono animated text "Loading..." or minimal CSS border spinner in gold

---

## 7. SearchBar (`src/Components/navbar/SearchBar.jsx`)

**Input container:**
- `display: flex`, `border: 1px solid var(--border)`, `background: var(--surface)`, NO border-radius
- Focus state: border color transitions to `var(--gold)` (via JS class toggle or CSS `:focus-within`)

**Search icon:** DM Mono `⌕` or `FaSearch` in `var(--gold)`, `padding: 10px 14px`, `border-right: 1px solid var(--border)`

**Input field:** DM Mono 10px, `color: var(--text)`, `placeholder-color: var(--text-muted)`, transparent bg

**Clear button:** `FaTimes` in `var(--text-muted)`, hover `var(--text)`

**Submit button:** `border-left: 1px solid var(--border)`, DM Mono uppercase "SEARCH", `color: var(--gold)` when active, `var(--text-dim)` when disabled

**Suggestions dropdown:**
- `background: var(--surface)`, `border: 1px solid var(--border)`, NO border-radius
- Each suggestion: DM Mono 9px, `border-bottom: 1px solid var(--border-light)`, hover bg `var(--surface-2)`

---

## 8. Footer (`src/Components/footer/Footer.jsx`)

**Structure:** 3-column grid (2fr + 1fr + 1fr), `padding: 40px 48px`, `border-top: 1px solid var(--border)`

**Column 1 — Brand:**
- Cormorant italic wordmark "Visual Gallery" (gold accent on "Gallery")
- DM Mono 9px body tagline below
- Newsletter: underline-style flat input + gold-bordered subscribe button

**Column 2 — Navigation:**
- DM Mono 8px gold uppercase column title + thin bottom rule
- Links in DM Mono 9px `var(--text-muted)`, hover `var(--text)`

**Column 3 — Connect:**
- Same column title style
- Social icon links: square `32px`, `border: 1px solid var(--border)`, no border-radius, icon in `var(--text-muted)`, hover icon `var(--gold)` + border `var(--gold)`

**Bottom bar:**
- `border-top: 1px solid var(--border)`, `padding: 12px 48px`
- Flex row space-between
- DM Mono 8px muted copyright left, privacy links right

---

## 9. About Page (`src/Components/about/About.jsx`)

**Hero:** Same editorial hero as Home — issue label + large Cormorant heading + gold rule. No blurred circles.

**Mission Section:** `background: var(--surface)`, centered large italic Cormorant body text.

**Features:** 4-column grid. Each card: `background: var(--surface-2)`, `border: 1px solid var(--border)`, `padding: 24px`, no border-radius. Replace colored icons with DM Mono gold number (01–04) top-left. Title in Cormorant 300, description in DM Mono 9px muted.

**Stats:** Same as Home stats section (large Cormorant numbers, DM Mono labels, gold dividers).

**Team:** Remove gradient overlays. Cards: `border: 1px solid var(--border)`, portrait image with `filter: grayscale(20%)`, thin gold border on hover. Social icons: square 28px dark buttons.

**Values:** 2-column grid. Each item: thin left gold bar (`border-left: 2px solid var(--gold)`), `padding-left: 16px`. Replace gradient icon circles with DM Mono gold symbols.

**CTA:** Background `var(--bg)`, Cormorant italic heading, two flat buttons.

---

## 10. Image Generator (`src/Components/Image-to-Text/image.jsx`)

**Functional / dark / no editorial flair.**

**Page header:** compact — Cormorant italic "AI Generator" + DM Mono "FLUX · NEBIUS" label. No hero section.

**Layout:** 2-column grid (`300px` sidebar + `1fr` canvas)

**Sidebar:**
- `background: var(--surface)`, `border-right: 1px solid var(--border)`, `padding: 20px`
- DM Mono labels in gold above each section
- Textarea: `background: var(--surface-2)`, `border: 1px solid var(--border)`, DM Mono font, no border-radius
- Generate button: full-width `.btn-gold`
- Prompt suggestions: plain list, DM Mono 8px, `border-bottom: 1px solid var(--border-light)`
- History: thumbnail + truncated prompt text, same border-bottom rhythm

**Canvas area:**
- Empty state: `background: var(--surface-2)`, centered DM Mono muted text
- Loading: simple CSS spinner (gold border-top on rotating circle) + DM Mono "Generating..." text
- Result: image fills area, `object-fit: contain`; download/expand buttons appear as small dark squares top-right (same as gallery card actions)
- Resolution/model info below: 3 small DM Mono stat chips, `border: 1px solid var(--border)`

---

## 11. Image Editor (`src/Components/Image-to-Text/ImageEditor.jsx`)

**Functional / dark / no editorial flair.**

**Page header:** same compact style as Generator — Cormorant italic "Image Editor" + DM Mono model name.

**Layout:** 3-panel — narrow tool rail left (`200px`) + canvas center (`1fr`) + detail sidebar right (`240px`)

**Tool rail:**
- `background: var(--surface)`, `border-right: 1px solid var(--border)`
- Upload button: gold-bordered full-width flat button
- Model selector: custom `<select>` styled dark — `background: var(--surface-2)`, `border: 1px solid var(--border)`, DM Mono font

**Canvas:**
- Upload dropzone: `border: 1px dashed var(--gold)`, DM Mono upload hint text, centered
- Uploaded image fills canvas at natural aspect ratio

**Edit sidebar:**
- Edit prompt textarea, same style as Generator
- Generate Edit button: `.btn-gold`
- Undo/redo: small square icon buttons, `border: 1px solid var(--border)`
- Edit history: thumbnail list with thin dividers

---

## 12. File Change Summary

| File | Change Type |
|------|-------------|
| `src/index.css` | Full rewrite — tokens, fonts, utilities, scrollbar |
| `src/Components/navbar/Navbar.jsx` | Full rewrite — editorial masthead |
| `src/Components/Home/Home.jsx` | Full rewrite — editorial hero + sections |
| `src/Components/navbar/SearchBar.jsx` | Full rewrite — flat dark input |
| `src/Components/gallery/Gallery.jsx` | Full rewrite — compact header + dark masonry |
| `src/Components/footer/Footer.jsx` | Full rewrite — editorial colophon |
| `src/Components/about/About.jsx` | Full rewrite — editorial dark treatment |
| `src/Components/Image-to-Text/image.jsx` | Full rewrite — functional dark tool |
| `src/Components/Image-to-Text/ImageEditor.jsx` | Full rewrite — functional dark tool |
| `src/App.css` | Clear — no app-level styles needed |

---

## 13. Out of Scope

- Redux store, routing, API calls — no changes
- Unsplash API key or Nebius API key — no changes
- Component file structure — no new files created
- `src/Layout.jsx` — no changes (wraps Navbar + children + Footer)
