// // components/FeaturedWork.jsx
// import "../css/FeaturedWork.css";

// const projects = [
//   {
//     id: 1,
//     tags: "WEB • DESIGN • DEVELOPMENT • 3D",
//     name: "Devin AI",
//     cardClass: "card-1",
//     preview: (
//       <div className="card-1-inner">
//         <div className="badge">⚙ Built by Cognition</div>
//         <h3>
//           Devin<br />is a collaborative<br />AI teammate
//         </h3>
//         <p>Built to help engineering teams strive for more ambitious goals.</p>
//       </div>
//     ),
//   },
//   {
//     id: 2,
//     tags: "CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO",
//     name: "Boundless Dreams Machine",
//     cardClass: "card-2",
//     preview: <div className="flowers-scene">🌸🌺🌼🌻🌷</div>,
//     delay: "0.15s",
//   },
// ];

// export default function FeaturedWork() {
//   return (
//     <section className="work-section">
//       {/* ── Header ── */}
//       <div className="work-header reveal">
//         <div className="work-title">Featured Work</div>
//         <div className="work-subtitle">
//           A SELECTION OF IMMERSIVE DIGITAL EXPERIENCES CREATED FOR AMBITIOUS
//           BRANDS AND FORWARD THINKING TEAMS.
//         </div>
//       </div>

//       {/* ── Cards ── */}
//       <div className="work-grid">
//         {projects.map((p) => (
//           <div
//             key={p.id}
//             className={`work-card ${p.cardClass} reveal`}
//             style={p.delay ? { transitionDelay: p.delay } : undefined}
//           >
//             <div className="card-img-wrap">
//               <div className="card-img-placeholder">{p.preview}</div>
//             </div>
//             <div className="card-meta">
//               <div className="card-tags">{p.tags}</div>
//               <div className="card-name">{p.name}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// components/FeaturedWork.jsx
// Updated with 6 total project cards

import "../css/FeaturedWork.css";

const projects = [
  {
    id: 1,
    tags: "WEB • DESIGN • DEVELOPMENT • 3D",
    name: "Devin AI",
    cardClass: "card-1",
    preview: (
      <div className="card-1-inner">
        <div className="badge">⚙ Built by Cognition</div>
        <h3>
          Devin<br />is a collaborative<br />AI teammate
        </h3>
        <p>Built to help engineering teams strive for more ambitious goals.</p>
      </div>
    ),
  },
  {
    id: 2,
    tags: "CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO",
    name: "Boundless Dreams Machine",
    cardClass: "card-2",
    preview: <div className="flowers-scene">🌸🌺🌼🌻🌷</div>,
    delay: "0.15s",
  },
  {
    id: 3,
    tags: "BRANDING • IDENTITY • MOTION",
    name: "Nova Studio",
    cardClass: "card-3",
    preview: (
      <div className="card-3-inner">
        <div className="orbit-ring" />
        <div className="orbit-ring ring-2" />
        <div className="orbit-dot" />
        <span className="nova-label">NOVA</span>
      </div>
    ),
    delay: "0.2s",
  },
  {
    id: 4,
    tags: "UI/UX • DASHBOARD • DATA VIZ",
    name: "Pulse Analytics",
    cardClass: "card-4",
    preview: (
      <div className="card-4-inner">
        <div className="pulse-bars">
          {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85].map((h, i) => (
            <div
              key={i}
              className="pulse-bar"
              style={{ "--bar-h": `${h}%`, "--bar-delay": `${i * 0.08}s` }}
            />
          ))}
        </div>
        <div className="pulse-stat">
          <span className="pulse-number">+128%</span>
          <span className="pulse-label">Growth this quarter</span>
        </div>
      </div>
    ),
    delay: "0.25s",
  },
  {
    id: 5,
    tags: "EDITORIAL • TYPOGRAPHY • PRINT",
    name: "Monolith Magazine",
    cardClass: "card-5",
    preview: (
      <div className="card-5-inner">
        <div className="mono-issue">Issue 07</div>
        <div className="mono-headline">THE<br />FUTURE<br />IS QUIET</div>
        <div className="mono-rule" />
        <div className="mono-sub">A publication on design, silence, and slow ideas.</div>
      </div>
    ),
    delay: "0.3s",
  },
  {
    id: 6,
    tags: "AR • SPATIAL • INTERACTIVE • XR",
    name: "Ether Layer",
    cardClass: "card-6",
    preview: (
      <div className="card-6-inner">
        <div className="ether-grid" />
        <div className="ether-orb" />
        <div className="ether-orb orb-2" />
        <div className="ether-text">
          <span>SPATIAL</span>
          <span>EXPERIENCE</span>
        </div>
      </div>
    ),
    delay: "0.35s",
  },
];

export default function FeaturedWork() {
  return (
    <section className="work-section">
      {/* ── Header ── */}
      <div className="work-header reveal">
        <div className="work-title">Featured Work</div>
        <div className="work-subtitle">
          A SELECTION OF IMMERSIVE DIGITAL EXPERIENCES CREATED FOR AMBITIOUS
          BRANDS AND FORWARD THINKING TEAMS.
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="work-grid">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`work-card ${p.cardClass} reveal`}
            style={p.delay ? { transitionDelay: p.delay } : undefined}
          >
            <div className="card-img-wrap">
              <div className="card-img-placeholder">{p.preview}</div>
            </div>
            <div className="card-meta">
              <div className="card-tags">{p.tags}</div>
              <div className="card-name">{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}