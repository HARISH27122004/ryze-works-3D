import { useEffect, useRef } from "react";
import FooterVideo from "../Videos/3D-Video.mp4";
import '../Css/FooterScrollVideo.css';

export default function FooterScrollVideo() {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const lastScrollY = useRef(0);
  const reverseInterval = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    // Unlock video for scroll-driven playback
    video.addEventListener("loadedmetadata", () => {
      video.play().then(() => video.pause());
    });

    // ── Clip-path reveal driven by scroll ────────────────────────────────
    const handleReveal = () => {
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;

      // Progress: 0 when wrapper top is at viewport bottom, 1 when wrapper
      // top reaches 40% up the viewport (transition completes quickly)
      const raw = (vh - rect.top) / (vh * 0.6);
      const progress = Math.min(1, Math.max(0, raw));

      // Radius: 0 → 150vmax (covers all corners from center origin)
      const maxR = Math.hypot(window.innerWidth, window.innerHeight);
      const r = progress * maxR;

      // Origin: center-bottom of wrapper (feels like it emanates from the section below)
      const cx = 50; // % — horizontal center
      const cy = 0;  // % — very top of video section (bottom of About)

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        wrapper.style.clipPath = `circle(${r}px at ${cx}% ${cy}%)`;
        wrapper.style.opacity = String(Math.min(1, progress * 1.5));
      });
    };

    // ── Forward / backward scroll playback ───────────────────────────────
    const playForward = () => {
      clearInterval(reverseInterval.current);
      video.playbackRate = 1;
      video.play();
    };

    const playBackward = () => {
      video.pause();
      clearInterval(reverseInterval.current);
      reverseInterval.current = setInterval(() => {
        if (video.currentTime <= 0) {
          clearInterval(reverseInterval.current);
        } else {
          video.currentTime -= 0.04;
        }
      }, 30);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Reveal animation
      handleReveal();

      // Only drive video playback once fully revealed
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect && rect.top <= 0) {
        if (currentScrollY > lastScrollY.current) {
          playForward();
        } else {
          playBackward();
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // Set initial state: fully hidden
    wrapper.style.clipPath = `circle(0px at 50% 0%)`;
    wrapper.style.opacity = "0";

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleReveal(); // run once on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(reverseInterval.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="footer-scroll-wrapper"
      style={{ height: "200vh" }}
    >
      <video
        ref={videoRef}
        src={FooterVideo}
        muted
        playsInline
        preload="auto"
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}