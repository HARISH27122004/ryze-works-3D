// components/Cursor.jsx
import { useEffect, useRef, useState } from "react";
import "../css/Cursor.css";

export default function Cursor() {
  const cursorRef = useRef(null);
  const ringRef   = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let raf;
    let cx = 0, cy = 0, rx = 0, ry = 0;

    const onMove = (e) => { cx = e.clientX; cy = e.clientY; };
    window.addEventListener("mousemove", onMove);

    function animate() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = cx + "px";
        cursorRef.current.style.top  = cy + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top  = ry + "px";
      }
      raf = requestAnimationFrame(animate);
    }
    animate();

    // Attach hover listeners with a short delay so DOM is ready
    const attachHoverListeners = () => {
      document.querySelectorAll("button, a, .work-card, .device-frame").forEach((el) => {
        el.addEventListener("mouseenter", () => setHovering(true));
        el.addEventListener("mouseleave", () => setHovering(false));
      });
    };
    const timer = setTimeout(attachHoverListeners, 500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={`cursor${hovering ? " hovering" : ""}`} />
      <div ref={ringRef}   className={`cursor-ring${hovering ? " hovering" : ""}`} />
    </>
  );
}