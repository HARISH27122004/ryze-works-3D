// utils/splitWords.jsx
// Must be .jsx because it returns JSX elements.

/**
 * Splits a string into individually animated <span> words.
 * Each word gets a staggered transitionDelay so they cascade in on scroll.
 *
 * Usage:
 *   import { splitWords } from "../utils/splitWords";
 *   <div className="line">{splitWords("Hello World")}</div>
 */
export function splitWords(text) {
  return text.split(" ").map((word, i) => (
    <span
      key={i}
      className="word"
      style={{ transitionDelay: `${i * 0.07}s` }}
    >
      {word}&nbsp;
    </span>
  ));
}