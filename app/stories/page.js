import collection from "../../collection.config.js";
import EntryCard from "../../components/EntryCard.js";
import entries from "../../data/entries.js";

export default async function StoriesPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const query = q.toLowerCase();

  const sorted = [...entries].sort((a, b) => a.year - b.year);
  const list = query
    ? sorted.filter((entry) => entry.title.toLowerCase().includes(query))
    : sorted;

  return (
    <main
      style={{
        maxWidth: 840,
        margin: "0 auto",
        padding: "var(--space-2xl) var(--space-lg)",
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
        The Diary
      </p>

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
        All Stories
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.7,
          margin: 0,
          maxWidth: "65ch",
        }}
      >
        {query
          ? `Stories whose title matches "${q}":`
          : "A timeline of family memories, from 2010 to today."}
      </p>

      {list.length === 0 ? (
        <div
          role="status"
          style={{
            marginTop: "var(--space-2xl)",
            padding: "var(--space-2xl) var(--space-lg)",
            textAlign: "center",
            backgroundColor: "var(--color-surface)",
            border: "1px dashed var(--color-border-strong)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--color-text-primary)",
            }}
          >
            No stories match "{q}"
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              margin: "var(--space-sm) 0 0",
              lineHeight: 1.6,
            }}
          >
            Search checks story titles only — try a Khmer or English name, like
            បុណ្យ or "new year".
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
            marginTop: "var(--space-2xl)",
          }}
        >
          {list.map((entry) => (
            <EntryCard
              key={entry.title}
              title={entry.title}
              description={entry.description}
              contributor={entry.contributor}
              place={entry.place}
              year={entry.year}
            />
          ))}
        </div>
      )}

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
        2026.
      </footer>
    </main>
  );
}