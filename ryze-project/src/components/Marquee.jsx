// components/Marquee.jsx
import "../css/Marquee.css";

const ITEMS = [
  "3D DESIGN",
  "INTERACTIVE WEB",
  "MOTION",
  "CREATIVE DIRECTION",
  "DEVELOPMENT",
  "BRAND EXPERIENCES",
  "IMMERSIVE STORYTELLING",
  "VISUAL CRAFT",
];

export default function Marquee() {
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {/* Duplicate items twice so the loop is seamless */}
        {[...Array(2)].map((_, i) =>
          ITEMS.map((label) => (
            <span key={`${i}-${label}`} className="marquee-item">
              {label}
            </span>
          ))
        )}
      </div>
    </div>
  );
}