import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import ThemeToggle from "../components/ThemeToggle.js";
import entries from "../data/entries.js";

export default function Home() {
  const [first, ...rest] = entries;

  return (
    <main
      style={{
        maxWidth: 840,
        margin: "0 auto",
        padding: "var(--space-2xl) var(--space-lg)",
      }}
    >
      {/* ---- Header Row: Kicker + Theme Toggle ---- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
          Khmer Living Archive
        </p>
        <ThemeToggle />
      </div>

      {/* ---- Title ---- */}
      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          margin: "var(--space-md) 0 var(--space-sm)",
          color: "var(--color-text-primary)",
        }}
      >
        {collection.name}
      </h1>

      {/* ---- Description ---- */}
      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.7,
          margin: 0,
          maxWidth: "65ch",
        }}
      >
        {collection.description}
      </p>

      {/* ---- Archive Section Header ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
          marginTop: "var(--space-2xl)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <hr
          style={{
            flex: 1,
            border: "none",
            borderTop: "1px solid var(--color-border)",
            margin: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          The Archive · {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
        <hr
          style={{
            flex: 1,
            border: "none",
            borderTop: "1px solid var(--color-border)",
            margin: 0,
          }}
        />
      </div>

      {/* ---- Featured Entry (full-width hero) ---- */}
      <EntryCard
        key={first.title}
        title={first.title}
        description={first.description}
        contributor={first.contributor}
        place={first.place}
        index={1}
        featured
      />

      {/* ---- Remaining Entries Grid ---- */}
      <div className="entry-grid" style={{ marginTop: "var(--space-lg)" }}>
        {rest.map((entry, i) => (
          <EntryCard
            key={entry.title}
            title={entry.title}
            description={entry.description}
            contributor={entry.contributor}
            place={entry.place}
            index={i + 2}
          />
        ))}
      </div>

      {/* ---- Footer ---- */}
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
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
