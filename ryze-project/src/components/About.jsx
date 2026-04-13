// components/About.jsx
import { useEffect, useRef } from "react";
import { splitWords } from "../utils/SplitWords.jsx";
import "../css/About.css";
import FooterScrollVideo from "./FooterScrollVideo.jsx";

// ─────────────────────────────────────────────────────────────────────────────
//  THE PATH — traced from the Lusion reference video:
//
//  The stroke is a FULL-WIDTH decorative curve that:
//    1. Enters from the far right at the top (off-screen right)
//    2. Sweeps left in a wide flat arc across the viewport
//    3. Curves down and left into a large loop / spiral
//    4. The loop circles back up and to the right
//    5. Exits to the right mid-screen
//
//  ViewBox is 1920×1800 (matches a 1920px-wide page, 1800 tall to cover the section)
//  The path uses coordinates in that space.
//
//  To adjust:
//   - Move start/end off-screen by changing x values beyond 0 or 1920
//   - Change the loop size by adjusting the bezier control points
//   - STROKE_LENGTH should be >= path.getTotalLength() — bump it if it cuts short
// ─────────────────────────────────────────────────────────────────────────────
const PATH_D = `
  M 2000 180
  C 1600 80,  1100 60,  700  200
  C 350  320, 200  480, 260  680
  C 320  880, 560  980, 800  900
  C 1040 820, 1100 620, 960  480
  C 820  340, 560  380, 460  520
  C 360  660, 440  820, 600  860
  C 760  900, 920  820, 1000 700
  C 1080 580, 1060 420, 1200 320
  C 1400 180, 1700 200, 2000 300
`;

const STROKE_LENGTH = 5200;   // set to path.getTotalLength() in browser console for precision
const STROKE_WIDTH  = 50;     // thick like in the video
const STROKE_COLOR  = "#00e5d4";
const VIEW_BOX      = "0 0 1920 1100";
// ─────────────────────────────────────────────────────────────────────────────

export default function About() {
  const svgPathRef = useRef(null);
  const sectionRef = useRef(null);
  const rafRef     = useRef(null);

  useEffect(() => {
    const path    = svgPathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    const totalLength = path.getTotalLength?.() || STROKE_LENGTH;

    // Start fully hidden
    path.style.strokeDasharray  = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;
    path.style.transition       = "none";

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;

      // 0 = section top at viewport bottom (just appeared)
      // 1 = section bottom at viewport top (fully scrolled past)
      const progress = Math.min(1, Math.max(0,
        (vh - rect.top) / (vh + rect.height)
      ));

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        path.style.transition       = "none";
        path.style.strokeDashoffset = `${totalLength * (1 - progress)}`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
    <section className="about-section" ref={sectionRef}>

      {/* ── Full-width scroll-driven SVG curve (behind everything) ── */}
      <svg
        className="cyan-curve"
        viewBox={VIEW_BOX}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={svgPathRef}
          d={PATH_D}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ── Heading with word-reveal ── */}
      <div className="about-heading word-reveal">
        <div className="line">{splitWords("Where Creative")}</div>
        <div className="line">{splitWords("Ideas Become")}</div>
        <div className="line">{splitWords("Immersive")}</div>
        <div className="line">{splitWords("Experiences")}</div>
      </div>

      {/* ── Body: device + text ── */}
      <div className="about-body reveal">

        {/* 3-D device frame */}
        <div className="about-media">
          <div className="device-frame">
            <div className="device-screen">
              <div className="astronaut-scene">
                <div className="stars" />
                <div className="earth-glow" />
                
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="about-text">
          <p>
            We do not chase trends or produce work that looks like everyone
            else. We focus on creating visually distinctive digital experiences
            that reflect your brand, engage your audience, and make people
            remember what they saw.
          </p>
          <p>
            Our process blends creative direction, 3D craft, and interactive
            development to build tailored digital journeys that feel original,
            polished, and built for impact.
          </p>
        </div>

      </div>
    </section>
                <FooterScrollVideo/>
</>
  );
}