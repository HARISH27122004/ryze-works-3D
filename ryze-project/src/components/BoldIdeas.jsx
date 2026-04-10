import { splitWords } from "../utils/SplitWords.jsx";
import "../css/BoldIdeas.css";
import { useEffect, useRef } from "react";

export default function BoldIdeas() {
  const pathRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;

    if (!path || !container) return;

    // SVG path properties
    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = totalLength;
    path.style.strokeDashoffset = totalLength;

    const handleScroll = () => {
      // Get the position of the section relative to viewport
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate when section enters and leaves viewport
      // scrollProgress: 0 when section is below viewport, 1 when fully past it
      const scrollProgress = Math.max(0, Math.min(1, 1 - rect.top / viewportHeight));

      // Animate the stroke: 0 means no line, 1 means full line
      const strokeOffset = totalLength * (1 - scrollProgress);
      path.style.strokeDashoffset = strokeOffset;
    };

    window.addEventListener("scroll", handleScroll);
    // Initial call
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bold-section" ref={containerRef}>
      <div className="bold-inner">

        {/* ── Left column ── */}
        <div className="bold-left">
          {/* Animated blue SVG curve - Scroll responsive */}
          <svg
            className="blue-curve"
            viewBox="0 0 350 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={pathRef}
              d="M320 20 C180 60, 50 160, 160 280 C240 370, 80 430, 120 490"
              stroke="#3a3aff"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.1s ease-out",
              }}
            />
          </svg>

          {/* Giant heading */}
          <div className="bold-heading word-reveal">
            <div className="line">{splitWords("Bold")}</div>
            <div className="line">{splitWords("Ideas,")}</div>
            <div className="line">{splitWords("Brought to")}</div>
            <div className="line">{splitWords("Life")}</div>
          </div>

          {/* Blue-tinted image */}
          <div className="bold-image reveal">
            <div className="bold-img-inner">
              <div className="blue-overlay" />
              <div className="person-silhouette">🧑‍🎨</div>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="bold-right reveal">
          <p>
            We combine design, motion, 3D, and development to create digital
            experiences that feel visually striking and technically seamless.
            From campaign launches to immersive brand worlds, we build work that
            captures attention and invites interaction.
          </p>
          <button className="btn-approach">OUR APPROACH</button>
        </div>

      </div>
    </section>
  );
}