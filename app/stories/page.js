"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EntryCard from "../../components/EntryCard.js";
import { createClient } from "../../lib/supabase/browser.js";

function StoriesContent() {
  const searchParams = useSearchParams();
  const q = typeof searchParams.get("q") === "string" ? searchParams.get("q").trim() : "";
  const query = q.toLowerCase();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  // How the flat list is ordered: by time posted (newest first) by default,
  // or by the year the story happened.
  const [sort, setSort] = useState("posted");

  useEffect(() => {
    setLoading(true);
    const supabase = createClient();
    // The public archive only shows published stories. RLS already keeps
    // pending rows away from visitors; the filter also keeps the signed-in
    // user's own pending rows off this public page.
    let request = supabase
      .from("entries")
      .select("*")
      .eq("status", "published")
      .order("year", { ascending: false });

    if (query) {
      request = request.ilike("title", `%${query}%`);
    }

    request.then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setEntries(data);
      }
      setLoading(false);
    });
  }, [query]);

  /* Safe posted-time milliseconds; a missing or unreadable timestamp sorts
     last instead of crashing. */
  const postedAt = (entry) => {
    if (!entry || !entry.created_at) return 0;
    const time = new Date(entry.created_at).getTime();
    return Number.isNaN(time) ? 0 : time;
  };

  /* Flat list, sorted by the chosen mode. The search filter already ran in
     the effect, so this only orders the filtered set. */
  const sortedEntries = [...entries].sort((a, b) => {
    if (sort === "year") {
      return b.year - a.year || postedAt(b) - postedAt(a);
    }
    return postedAt(b) - postedAt(a) || b.year - a.year;
  });

  return (
    <main
      style={{
        maxWidth: 1200,
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

      {loading ? (
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
            {query ? "Searching…" : "Loading stories…"}
          </p>
        </div>
      ) : entries.length === 0 ? (
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
            {query
              ? `No stories match "${q}"`
              : "No entries yet"}
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              margin: "var(--space-sm) 0 0",
              lineHeight: 1.6,
            }}
          >
            {query
              ? "Try a Khmer or English title, like បុណ្យ or &ldquo;new year&rdquo;."
              : "Stories will appear here once they are submitted and published."}
          </p>
        </div>
      ) : (
        <>
          {/* Sort control: time posted (newest first) is the default; the
              alternative orders by the year the story happened. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-md)",
              margin: "0 0 var(--space-lg)",
            }}
          >
            <label
              htmlFor="stories-sort"
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
                margin: 0,
              }}
            >
              Sort by
            </label>
            <select
              id="stories-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-sm) var(--space-md)",
                cursor: "pointer",
              }}
            >
              <option value="posted">Newest first</option>
              <option value="year">By year</option>
            </select>
          </div>

          {/* One flat grid: every card sized the same, no year groups. */}
          <div className="entry-grid">
            {sortedEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                title={entry.title}
                description={entry.description}
                contributor={entry.contributor}
                place={entry.place}
                year={entry.year}
                created_at={entry.created_at}
                photo_url={entry.photo_url}
                href={`/entries/${entry.id}`}
              />
            ))}
          </div>
        </>
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

export default function StoriesPage() {
  return (
    <Suspense fallback={null}>
      <StoriesContent />
    </Suspense>
  );
}