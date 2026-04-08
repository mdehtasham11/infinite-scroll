import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../navbar/SearchBar";

const features = [
  { num: "01", title: "Infinite Gallery",    desc: "Browse thousands of high-quality images with infinite scroll through the Unsplash collection." },
  { num: "02", title: "AI Generation",       desc: "Create stunning images using advanced AI — describe your vision and watch it come to life." },
  { num: "03", title: "AI Image Editing",    desc: "Upload and transform your images with powerful AI editing tools powered by Flux Kontext." },
  { num: "04", title: "Curated Collection",  desc: "Discover handpicked images from talented creators worldwide, updated continuously." },
];

const stats = [
  { number: "10M+",  label: "Images Served" },
  { number: "2M+",   label: "Downloads"     },
  { number: "500K+", label: "Favorites"     },
  { number: "100K+", label: "Images"        },
];

const featuredImages = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",           title: "Mountain Majesty", span: true },
  { url: "https://images.unsplash.com/photo-1741524915320-8fee76e41424?w=400&auto=format&fit=crop&q=80",           title: "Sunset Dreams"             },
  { url: "https://images.unsplash.com/photo-1741017269648-44a2497aba20?w=400&auto=format&fit=crop&q=80",           title: "Urban Poetry"              },
  { url: "https://images.unsplash.com/photo-1616939750001-566f1e189f2c?w=400&auto=format&fit=crop&q=80",           title: "Nature's Canvas"           },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=80&crop=bottom", title: "Lake Reflection"           },
];

const Home = () => (
  <div style={{ background: "var(--bg)" }}>

    {/* ── Hero ── */}
    <section className="px-section" style={{ paddingTop: "72px", paddingBottom: "64px", borderBottom: "1px solid var(--border)" }}>
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
    <section className="px-section" style={{ paddingTop: "48px", paddingBottom: "48px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <h2 className="serif-display" style={{ fontSize: "32px" }}>Featured</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "2px" }}>04 images</span>
        </div>
        <div className="grid-featured">
          {featuredImages.map((img, i) => (
            <div key={i} className={img.span ? "featured-main" : undefined} style={{ position: "relative", overflow: "hidden", background: "var(--surface-2)" }}>
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
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
    <section className="px-section" style={{ paddingTop: "48px", paddingBottom: "48px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
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
    <section className="px-section" style={{ paddingTop: "64px", paddingBottom: "64px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="label-mono" style={{ marginBottom: "40px" }}>By the numbers</div>
        <div className="grid-stats">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="serif-display" style={{ fontSize: "56px", lineHeight: 1, color: "var(--gold)", marginBottom: "8px" }}>{s.number}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="px-section" style={{ paddingTop: "72px", paddingBottom: "72px", background: "var(--surface)" }}>
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
