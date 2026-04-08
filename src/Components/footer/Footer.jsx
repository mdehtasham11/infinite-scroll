import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const quickLinks = [
  { name: "Home",            path: "/" },
  { name: "Gallery",         path: "/gallery" },
  { name: "Generate Images", path: "/image" },
  { name: "Edit Images",     path: "/editor" },
  { name: "About",           path: "/about" },
];

const socialLinks = [
  { icon: <FaTwitter size={12} />,   label: "Twitter",   href: "#" },
  { icon: <FaInstagram size={12} />, label: "Instagram", href: "#" },
  { icon: <FaLinkedin size={12} />,  label: "LinkedIn",  href: "#" },
  { icon: <FaGithub size={12} />,    label: "GitHub",    href: "#" },
];

function SocialBtn({ icon, label, href }) {
  return (
    <a
      href={href}
      aria-label={label}
      style={{ width: "30px", height: "30px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      {icon}
    </a>
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
              <input
                type="email"
                placeholder="your@email.com"
                style={{ flex: 1, maxWidth: "200px", padding: "8px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRight: "none", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text)", outline: "none" }}
              />
              <button className="btn-gold" style={{ padding: "8px 16px", fontSize: "8px" }}>Subscribe</button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              Navigation
            </div>
            {quickLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", textDecoration: "none", letterSpacing: "1px", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Connect */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              Connect
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {socialLinks.map((s) => <SocialBtn key={s.label} {...s} />)}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: 2 }}>
              hello@visualgallery.com<br />
              support@visualgallery.com
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
            <a
              key={l}
              href="#"
              style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "1px", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
