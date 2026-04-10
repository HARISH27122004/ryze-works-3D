// components/Hero.jsx
import "../css/Hero.css";
import SafeBall from './Safeball.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-top">
        <p className="hero-tagline">
          We create 3D visual storytelling
          and interactive web experiences
          that help brands stand out
        </p>
      </div>

      <div className="hero-canvas-outer">
        <div className="hero-canvas">
          <SafeBall />
        </div>
      </div>


      <div className="hero-bottom">
        <span className="plus-mark">+</span>
        <span className="plus-mark center-plus">+</span>
        <span className="scroll-label">SCROLL TO EXPLORE</span>
        <span className="plus-mark center-plus">+</span>
        <span className="plus-mark">+</span>
      </div>
    </section>
  );
}
