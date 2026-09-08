"use client";

import { useState } from "react";
import EntryCard from "./EntryCard.js";

const labelStyle = {
  display: "block",
  fontFamily: "'Courier New', monospace",
  fontSize: "0.6875rem",
  color: "var(--color-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: "0 0 var(--space-sm)",
};

const countStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.6875rem",
  color: "var(--color-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: "var(--space-sm) 0 0",
};

export default function SearchableEntryList({ entries }) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();

  const matched = trimmed
    ? entries.filter((entry) =>
        entry.title.toLowerCase().includes(trimmed)
      )
    : entries;

  const [first, ...rest] = matched;

  return (
    <section aria-label="Search the archive">
      {/* ---- Search Input ---- */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <label htmlFor="archive-search" style={labelStyle}>
          Search the archive
        </label>
        <input
          id="archive-search"
          className="search-input"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title — e.g. Pchum Ben or បុណ្យ"
        />
        {trimmed && (
          <p style={countStyle}>
            {matched.length} of {entries.length}{" "}
            {matched.length === 1 ? "entry matches" : "entries match"}
          </p>
        )}
      </div>

      {/* ---- Results ---- */}
      {matched.length === 0 ? (
        trimmed ? (
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
              No entries match “{query.trim()}”
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
                margin: "var(--space-sm) 0 0",
                lineHeight: 1.6,
              }}
            >
              Search checks entry titles only — try a Khmer or English name,
              like បុណ្យ or “new year”.
            </p>
          </div>
        ) : null
      ) : (
        <>
          {/* ---- Featured Entry (first match, full-width hero) ---- */}
          <EntryCard
            key={first.title}
            title={first.title}
            description={first.description}
            contributor={first.contributor}
            place={first.place}
            index={1}
            featured
          />

          {/* ---- Remaining Matches Grid ---- */}
          {rest.length > 0 && (
            <div
              className="entry-grid"
              style={{ marginTop: "var(--space-lg)" }}
            >
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
          )}
        </>
      )}
    </section>
  );
}