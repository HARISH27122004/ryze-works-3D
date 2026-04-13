// App.jsx  –  Root entry point

import { useScrollReveal } from "./hooks/useScrollReveal";

import Cursor from "./components/Cursor.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import FeaturedWork from "./components/FeaturedWork.jsx";
import BoldIdeas from "./components/BoldIdeas.jsx";
import Marquee from "./components/Marquee.jsx";
import Footer from "./components/Footer.jsx";


export default function App() {
  // Activate scroll-reveal + word-reveal observers for the whole page
  useScrollReveal();

  return (
    <>
      <Cursor />

      <Navbar />

      {/* ── Page sections (top → bottom) ── */}
      <main>
        <Hero />
        <BoldIdeas />
        <FeaturedWork />
        <About />
      </main>

    </>
  );
}