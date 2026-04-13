
// import { useEffect, useRef, useState } from "react";
// import FooterVideo from "../Videos/3D-Video.mp4";
// import Footer from "./Footer";
// import Marquee from "./Marquee";
// import '../css/FooterScrollVideo.css';

// export default function FooterScrollVideo() {
//   const videoRef      = useRef(null);
//   const wrapperRef    = useRef(null);
//   const lastScrollY   = useRef(0);
//   const reverseInterval = useRef(null);
//   const rafRef        = useRef(null);
//   const [footerVisible, setFooterVisible] = useState(false);

//   useEffect(() => {
//     const video   = videoRef.current;
//     const wrapper = wrapperRef.current;
//     if (!video || !wrapper) return;

//     // Unlock video for scroll-driven playback
//     video.addEventListener("loadedmetadata", () => {
//       video.play().then(() => video.pause());
//     });

//     // ── Reveal footer ONLY when video finishes ────────────────────────────
//     const handleEnded = () => {
//       setFooterVisible(true);
//     };
//     video.addEventListener("ended", handleEnded);

//     // ── Clip-path reveal driven by scroll ────────────────────────────────
//     const handleReveal = () => {
//       const rect = wrapper.getBoundingClientRect();
//       const vh   = window.innerHeight;
//       const raw  = (vh - rect.top) / (vh * 0.6);
//       const progress = Math.min(1, Math.max(0, raw));
//       const maxR = Math.hypot(window.innerWidth, window.innerHeight);
//       const r    = progress * maxR;

//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       rafRef.current = requestAnimationFrame(() => {
//         wrapper.style.clipPath = `circle(${r}px at 50% 0%)`;
//         wrapper.style.opacity  = String(Math.min(1, progress * 1.5));
//       });
//     };

//     // ── Forward / backward scroll playback ───────────────────────────────
//     const playForward = () => {
//       clearInterval(reverseInterval.current);
//       video.playbackRate = 1;
//       video.play();
//     };

//     const playBackward = () => {
//       video.pause();
//       // Hide footer again if user scrubs back before it ended
//       setFooterVisible(false);
//       clearInterval(reverseInterval.current);
//       reverseInterval.current = setInterval(() => {
//         if (video.currentTime <= 0) {
//           clearInterval(reverseInterval.current);
//         } else {
//           video.currentTime -= 0.04;
//         }
//       }, 30);
//     };

//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       handleReveal();

//       const rect = wrapperRef.current?.getBoundingClientRect();
//       if (rect && rect.top <= 0) {
//         if (currentScrollY > lastScrollY.current) {
//           playForward();
//         } else {
//           playBackward();
//         }
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     // Initial state: video wrapper hidden
//     wrapper.style.clipPath = `circle(0px at 50% 0%)`;
//     wrapper.style.opacity  = "0";

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     handleReveal();

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       clearInterval(reverseInterval.current);
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       video.removeEventListener("ended", handleEnded);
//     };
//   }, []);

//   return (
//     <>
//       <div
//         ref={wrapperRef}
//         className="footer-scroll-wrapper"
//         style={{ height: "100vh" }}
//       >
//         <video
//           ref={videoRef}
//           src={FooterVideo}
//           muted
//           playsInline
//           preload="auto"
//           style={{
//             position: "sticky",
//             top: 0,
//             width: "100%",
//             height: "100vh",
//             objectFit: "cover",
//             display: "block",
//           }}
//         />
//       </div>

//       {/* Footer: hidden until video.ended fires */}
//       <div
//         className="footer-reveal"
//         style={{
//           opacity:        footerVisible ? 1 : 0,
//           pointerEvents:  footerVisible ? "auto" : "none",
//           transform:      footerVisible ? "translateY(0)" : "translateY(24px)",
//           transition:     "opacity 0.6s ease, transform 0.6s ease",
//         }}
//       >
//         <Marquee />
//         <Footer />
//       </div>
//     </>
//   );
// }

import { useEffect, useRef, useState } from "react";
import FooterVideo from "../Videos/3D-Video.mp4";
import Footer from "./Footer";
import Marquee from "./Marquee";
import '../css/FooterScrollVideo.css';

export default function FooterScrollVideo() {
  const videoRef        = useRef(null);
  const wrapperRef      = useRef(null);
  const lastScrollY     = useRef(window.scrollY);
  const reverseInterval = useRef(null);
  const rafRef          = useRef(null);
  const videoComplete   = useRef(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const video   = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    // ── Warm up decoder ───────────────────────────────────────────────────
    const onMetadata = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    video.addEventListener("loadedmetadata", onMetadata);

    // ── Detect video completion via timeupdate ────────────────────────────
    // "ended" event never fires when we manually control playback,
    // so we check currentTime on every tick instead.
    const checkVideoComplete = () => {
      if (!video.duration) return;
      if (video.currentTime >= video.duration - 0.3) {
        videoComplete.current = true;
        setFooterVisible(true);
      }
    };
    video.addEventListener("timeupdate", checkVideoComplete);

    // ── Clip-path reveal as section enters viewport ───────────────────────
    const handleReveal = (rect) => {
      const vh       = window.innerHeight;
      const raw      = (vh - rect.top) / (vh * 0.6);
      const progress = Math.min(1, Math.max(0, raw));
      const maxR     = Math.hypot(window.innerWidth, window.innerHeight);
      const r        = progress * maxR;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        wrapper.style.clipPath = `circle(${r}px at 50% 0%)`;
        wrapper.style.opacity  = String(Math.min(1, progress * 1.5));
      });
    };

    // ── Forward playback ──────────────────────────────────────────────────
    const playForward = () => {
      clearInterval(reverseInterval.current);
      // Already at the end — nothing to play
      if (video.duration && video.currentTime >= video.duration - 0.1) return;
      video.playbackRate = 1;
      video.play().catch(() => {});
    };

    // ── Backward scrub ────────────────────────────────────────────────────
    const playBackward = () => {
      video.pause();
      if (!videoComplete.current) setFooterVisible(false);
      clearInterval(reverseInterval.current);
      reverseInterval.current = setInterval(() => {
        if (video.currentTime <= 0) {
          clearInterval(reverseInterval.current);
        } else {
          video.currentTime -= 0.04;
        }
      }, 30);
    };

    // ── Main scroll handler ───────────────────────────────────────────────
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const rect = wrapper.getBoundingClientRect();

      // Always run the reveal animation
      handleReveal(rect);

      // ── THE FIX ──────────────────────────────────────────────────────────
      // Old condition:  rect.top <= 0
      //   Problem: wrapper is only 100vh tall with no sticky, so rect.top
      //   quickly becomes very negative as the user scrolls past it.
      //   The section leaves the viewport almost immediately, so playback
      //   stops firing after just a small scroll.
      //
      // New condition:  rect.top < vh && rect.bottom > 0
      //   This means: "the wrapper is currently anywhere in the viewport"
      //   (partially or fully visible). Playback fires for the entire time
      //   the video section is on screen.
      const vh = window.innerHeight;
      const isInViewport = rect.top < vh && rect.bottom > 0;

      if (isInViewport) {
        if (currentScrollY > lastScrollY.current) {
          playForward();
        } else {
          playBackward();
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // ── Initial state ─────────────────────────────────────────────────────
    wrapper.style.clipPath = `circle(0px at 50% 0%)`;
    wrapper.style.opacity  = "0";
    lastScrollY.current    = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount in case section is already visible
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(reverseInterval.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("timeupdate", checkVideoComplete);
    };
  }, []);

  return (
    <>
      <div ref={wrapperRef} className="footer-scroll-wrapper">
        <video
          ref={videoRef}
          src={FooterVideo}
          muted
          playsInline
          preload="auto"
          className="footer-scroll-video"
        />
      </div>

      <div className={`footer-reveal${footerVisible ? " footer-reveal--visible" : ""}`}>
        <Marquee />
        <Footer />
      </div>
    </>
  );
}