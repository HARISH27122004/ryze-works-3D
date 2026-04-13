import { splitWords } from "../utils/SplitWords.jsx";
import '../css/BoldIdeas.css';
import { useEffect, useRef } from "react";

export default function BoldIdeas() {
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    const svg = svgRef.current;

    if (!path || !container || !svg) return;

    const resizeObserver = new ResizeObserver(() => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    });
    resizeObserver.observe(container);

    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = totalLength;
    path.style.strokeDashoffset = totalLength;

    let currentOffset = totalLength;
    let targetOffset = totalLength;
    let animFrameId = null;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (viewportHeight - rect.top) / (viewportHeight * 1.6))
      );
      targetOffset = totalLength * (1 - scrollProgress);
    };

    const animate = () => {
      currentOffset += (targetOffset - currentOffset) * 0.025;
      path.style.strokeDashoffset = currentOffset;
      animFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    animFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section className="bold-section" ref={containerRef}>
      <svg
        ref={svgRef}
        className="blue-curve"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
      <path
  ref={pathRef}
  d="
    M -50 120
    C 120 80, 250 140, 320 260
    C 380 360, 500 420, 650 360
    C 780 300, 900 320, 1000 360
    C 1080 390, 1100 450, 1020 500
    C 940 550, 860 520, 860 460
    C 860 400, 940 380, 1020 420
    C 1150 480, 1350 520, 1650 500
    C 1850 480, 2050 460, 2400 470
  "
  stroke="#3a3aff"
  strokeWidth="50"
  fill="none"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
      </svg>

      <div className="bold-inner">

        <div className="bold-left">
          <div className="bold-heading word-reveal">
            <div className="line">{splitWords("Bold")}</div>
            <div className="line">{splitWords("Ideas,")}</div>
            <div className="line">{splitWords("Brought to")}</div>
            <div className="line">{splitWords("Life")}</div>
          </div>

          <div className="bold-image reveal">
            <div className="bold-img-inner">
              <div className="blue-overlay" />
              <div className="person-silhouette">🧑‍🎨</div>
            </div>
          </div>
        </div>

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