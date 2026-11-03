"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import { createClient } from "../lib/supabase/browser.js";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("entries")
      .select("*")
      // Only published stories belong on the public home page. (The RLS
      // policies already hide pending rows from visitors; the filter also
      // hides the logged-in user's own pending rows, which RLS would show.)
      .eq("status", "published")
      .order("year", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setEntries(data);
        }
        setLoading(false);
      });
  }, []);

  // Safe posted-time milliseconds; a missing or unreadable timestamp sorts
  // last instead of crashing.
  const postedAt = (entry) => {
    if (!entry || !entry.created_at) return 0;
    const time = new Date(entry.created_at).getTime();
    return Number.isNaN(time) ? 0 : time;
  };

  // Featured story: the published entry with the most clicks. Before any
  // clicks are recorded every entry ties at zero, so the tie-break (newest
  // posted first) keeps the old "latest story" behaviour.
  const [featured, ...rest] = [...entries].sort((a, b) => {
    const clicksDiff = (b.clicks ?? 0) - (a.clicks ?? 0);
    return clicksDiff !== 0 ? clicksDiff : postedAt(b) - postedAt(a);
  });

  // How many newest entries appear under the featured story. Kept as a named
  // constant so the count is tunable in one place instead of a magic number.
  const NEWEST_COUNT = 4;

  // The newest entries under the featured story, newest posted first. If fewer
  // than NEWEST_COUNT are published, whatever exists is simply shown — the
  // page never forces a fixed number of cards.
  const recent = [...rest]
    .sort((a, b) => postedAt(b) - postedAt(a) || b.year - a.year)
    .slice(0, NEWEST_COUNT);

  const hasEntries = !loading && entries.length > 0;

  const ruledHeader = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-md)",
        marginTop: "var(--space-2xl)",
        marginBottom: "var(--space-xl)",
      }}
    >
      <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--color-border)", margin: 0 }} />
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
        {loading
          ? "Loading…"
          : `The Diary · ${entries.length} ${entries.length === 1 ? "story" : "stories"}`}
      </span>
      <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--color-border)", margin: 0 }} />
    </div>
  );

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "var(--space-2xl) var(--space-lg)" }}>
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

      <p
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: "var(--space-md) 0 0",
        }}
      >
        Written by {collection.curator}
      </p>

      {ruledHeader}

      {loading ? (
        <div
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
              fontSize: "1.125rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--color-text-primary)",
            }}
          >
            Loading stories…
          </p>
        </div>
      ) : !hasEntries ? (
        <div
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
              fontSize: "1.125rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--color-text-primary)",
            }}
          >
            No entries yet
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              margin: "var(--space-sm) 0 0",
              lineHeight: 1.6,
            }}
          >
            Stories will appear here once they are submitted and published.
          </p>
        </div>
      ) : (
        <>
          {/* Featured story — the entry with the most clicks */}
          <EntryCard
            title={featured.title}
            description={featured.description}
            contributor={featured.contributor}
            place={featured.place}
            year={featured.year}
            created_at={featured.created_at}
            photo_url={featured.photo_url}
            featured
            href={`/entries/${featured.id}`}
          />

          {/* Newest stories */}
          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.375rem",
              fontWeight: 600,
              margin: "var(--space-2xl) 0 var(--space-lg)",
              color: "var(--color-text-primary)",
            }}
          >
            Newest stories
          </h2>

          <div className="entry-grid">
            {recent.map((entry) => (
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

      <p style={{ margin: "var(--space-2xl) 0 0" }}>
        <Link
          href="/stories"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            textDecoration: "none",
            borderBottom: "1px solid var(--color-accent)",
            paddingBottom: "2px",
          }}
        >
          Read all stories →
        </Link>
      </p>

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