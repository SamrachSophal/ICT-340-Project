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
      .order("year", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setEntries(data);
        }
        setLoading(false);
      });
  }, []);

  const sorted = [...entries].sort((a, b) => b.year - a.year);
  const [latest, ...recent] = sorted;

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
          {/* Latest story — featured */}
          <EntryCard
            title={latest.title}
            description={latest.description}
            contributor={latest.contributor}
            place={latest.place}
            year={latest.year}
            featured
          />

          {/* Recent stories */}
          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.375rem",
              fontWeight: 600,
              margin: "var(--space-2xl) 0 var(--space-lg)",
              color: "var(--color-text-primary)",
            }}
          >
            Recent stories
          </h2>

          <div className="entry-grid">
            {recent.slice(0, 2).map((entry) => (
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