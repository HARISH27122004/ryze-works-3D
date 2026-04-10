// hooks/useScrollReveal.js
import { useEffect } from "react";

/**
 * Watches elements with className "reveal" and adds "visible" when they enter viewport.
 * Also watches elements with className "word-reveal" and adds "visible" to inner .word spans.
 */
export function useScrollReveal() {
  useEffect(() => {
    // ── Reveal blocks ──
    const revealEls = document.querySelectorAll(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => revealObs.observe(el));

    // ── Word reveal ──
    const wordEls = document.querySelectorAll(".word-reveal");
    const wordObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".word").forEach((w) =>
              w.classList.add("visible")
            );
          }
        });
      },
      { threshold: 0.1 }
    );
    wordEls.forEach((el) => wordObs.observe(el));

    return () => {
      revealObs.disconnect();
      wordObs.disconnect();
    };
  }, []);
}