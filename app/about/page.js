import collection from "../../collection.config.js";
import about from "../../data/about.js";

const labelStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.6875rem",
  color: "var(--color-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: 0,
};

const valueStyle = {
  fontSize: "0.9375rem",
  color: "var(--color-text-primary)",
  margin: "4px 0 0",
  lineHeight: 1.6,
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "var(--space-2xl) var(--space-lg)" }}>
      <p
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.75rem",
          color: "var(--color-accent)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        About
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          margin: "var(--space-md) 0 var(--space-lg)",
          color: "var(--color-text-primary)",
        }}
      >
        About this diary
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.8,
          margin: "0 0 var(--space-lg)",
          maxWidth: "65ch",
        }}
      >
        {about.intro}
      </p>

      {about.story.map((paragraph, i) => (
        <p
          key={i}
          style={{
            fontSize: "1rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.8,
            margin: "0 0 var(--space-md)",
            maxWidth: "65ch",
          }}
        >
          {paragraph}
        </p>
      ))}

      <div
        style={{
          marginTop: "var(--space-2xl)",
          padding: "var(--space-lg)",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-xl)",
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <p style={labelStyle}>Curator</p>
          <p style={valueStyle}>{about.name}</p>
        </div>
        <div style={{ flex: "2 1 300px" }}>
          <p style={labelStyle}>Source</p>
          <p style={valueStyle}>{collection.source}</p>
        </div>
      </div>

      <footer
        style={{
          marginTop: "var(--space-3xl)",
          paddingTop: "var(--space-lg)",
          borderTop: "1px solid var(--color-border)",
          fontSize: "0.8125rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}
      >
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026.
      </footer>
    </main>
  );
}