// components/Footer.jsx
import "../css/Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">

        {/* ── Column 1 : Address + Contacts ── */}
        <div className="footer-col">
          <h4>Address</h4>
          <address>
            Bazaar Road, Mylapaore
          </address>

          <h4 style={{ marginTop: "32px" }}>General enquiries</h4>
          <a href="mailto:hello@ryzeworks.com">hello@ryzeworks.com</a>

          <h4 style={{ marginTop: "24px" }}>Call Us</h4>
          <a href="tel:+919150446985">+91 9150446985</a>
        </div>

        {/* ── Column 2 : Social links ── */}
        <div className="footer-col">
          <h4>Social</h4>
          <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="#" target="_blank" rel="noreferrer">Instagram</a>
        </div>

        {/* ── Column 3 : Newsletter ── */}
        <div className="footer-col newsletter-col">
          <h3>
            Subscribe to<br />our newsletter
          </h3>
          <div className="email-input-wrap">
            <input type="email" placeholder="Your email" />
            <button className="email-btn" aria-label="Subscribe">→</button>
          </div>
        </div>

      </div>

      {/* ── Footer Bottom Bar ── */}
      <div className="footer-bottom">
        <div></div>
        <span>© 2026 Ryze. All rights reserved</span>
        <button
          className="scroll-top-btn"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>
    </footer>
  );
}