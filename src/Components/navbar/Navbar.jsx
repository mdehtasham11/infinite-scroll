import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { to: "/",        label: "Home",     end: true },
  { to: "/gallery", label: "Gallery"             },
  { to: "/image",   label: "Generate"            },
  { to: "/editor",  label: "Edit"                },
  { to: "/about",   label: "About"               },
];

function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false);
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
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
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
