import EntryCard from "../../components/EntryCard.js";
import entries from "../../data/entries.js";

export default async function StoriesPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const query = q.toLowerCase();

  /* Filter entries by search query (title only, case-insensitive). */
  const filtered = query
    ? entries.filter((entry) => entry.title.toLowerCase().includes(query))
    : entries;

  /* Group filtered entries by year, preserving original array order. */
  const grouped = {};
  for (const entry of filtered) {
    if (!grouped[entry.year]) grouped[entry.year] = [];
    grouped[entry.year].push(entry);
  }

  /* Sort years descending (newest first). */
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

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
          margin: "0 0 var(--space-2xl)",
          maxWidth: "65ch",
        }}
      >
        {query
          ? `Stories whose title matches "${q}":`
          : "A timeline of family memories, from 2010 to today."}
      </p>

      {years.length === 0 ? (
        <div
          role="status"
          style={{
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
            No stories match &ldquo;{q}&rdquo;
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              margin: "var(--space-sm) 0 0",
              lineHeight: 1.6,
            }}
          >
            Try a Khmer or English title, like បុណ្យ or &ldquo;new year&rdquo;.
          </p>
        </div>
      ) : (
        /* Each year gets its own independent horizontal rail. */
        years.map((year) => (
          <section key={year} className="stories-year">
            <h2 className="stories-year-heading">{year}</h2>
            <div className="stories-card-rail">
              {grouped[year].map((entry) => (
                <EntryCard
                  key={entry.id}
                  title={entry.title}
                  description={entry.description}
                  contributor={entry.contributor}
                  place={entry.place}
                  year={entry.year}
                />
              ))}
            </div>
          </section>
        ))
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