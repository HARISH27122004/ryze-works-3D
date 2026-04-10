// components/Navbar.jsx
import { useState, useEffect } from "react";
import "../css/Navbar.css";

const NAV_LINKS = ["HOME", "ABOUT US", "PROJECTS", "CONTACT"];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);   // tracks current page
  const [hoveredIdx, setHoveredIdx] = useState(null); // tracks hover

  // dot shows on hovered item, falls back to active item
  const dotIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      {/* ── Full-screen Menu Overlay ── */}
      <div className={`menu-overlay${menuOpen ? " open" : ""}`}>

        {/* Top bar inside overlay */}
        <div className="menu-topbar">
          <span className="menu-logo">Ryze Works</span>
          <button className="menu-dots-btn" onClick={() => setMenuOpen(false)}>
            <span /><span />
          </button>
        </div>

        {/* Main nav links card */}
        <div className="menu-card menu-links-card">
          {NAV_LINKS.map((label, i) => (
            <a
              key={label}
              href="#"
              className={`menu-link${i === activeIdx ? " active" : ""}${i === hoveredIdx ? " hovered" : ""}`}
              style={{ "--i": i }}
              onClick={() => { setActiveIdx(i); setMenuOpen(false); }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {label}
              <span className={`active-dot${dotIdx === i ? " visible" : ""}`} />
            </a>
          ))}
        </div>

        {/* Let's Talk card */}
        <div className="menu-card menu-talk-card" style={{ "--i": 4 }}>
          <a href="#" className="menu-talk-link" onClick={() => setMenuOpen(false)}>
            LET'S TALK
          </a>
          <span className="talk-icon">☰</span>
        </div>

        {/* Labs card */}
        <div className="menu-card menu-labs-card" style={{ "--i": 5 }}>
          <div className="labs-left">
            <span className="labs-icon-mark">
              <span className="dot-eye" /><span className="dot-eye" />
              <span className="dot-pupil" />
            </span>
            <span className="labs-label">LABS</span>
          </div>
          <span className="labs-arrow">↗</span>
        </div>

      </div>

      {/* ── Navigation Bar ── */}
      <nav className={scrolled ? "scrolled" : ""}>
        <span className="nav-logo">Ryze Works</span>

        <div className="nav-right">
          <button className="btn-talk">LET'S TALK</button>

          <button className="btn-menu" onClick={() => setMenuOpen(true)}>
            MENU
            <span className="dots-icon">
              <span /><span />
            </span>
          </button>

           <button className="two-dots-btn" onClick={() => setMenuOpen(true)}>
            <span className="two-dots">
              <span /><span />
            </span>
          </button>

        </div>
      </nav>
    </>
  );
}