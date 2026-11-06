"use client";

import { useState } from "react";
import Link from "next/link";
import EntryPhoto from "./EntryPhoto.js";

const s = {
  // Small uppercase monospace label used above each value (matches the rest
  // of the archive's labeling pattern).
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.6875rem",
    color: "var(--color-text-muted)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: 0,
  },
  // Value shown beneath a label.
  value: {
    fontSize: "0.875rem",
    color: "var(--color-text-primary)",
    margin: "4px 0 0",
  },
  // The description sits at the very bottom of the card and keeps a readable
  // size and line spacing while being clamped so card heights stay even.
  description: {
    fontSize: "0.9375rem",
    color: "var(--color-text-secondary)",
    lineHeight: 1.7,
    margin: 0,
    maxWidth: "65ch",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  // A labelled key/value pair (label on one line, value on the next).
  field: {
    minWidth: 0,
  },
  // Subtle separator that gives the place block its own section under the
  // author, keeping the two apart without extra chrome. Kept tight so the
  // sections sit close together and the card stays compact.
  separatedBlock: {
    borderTop: "1px solid var(--color-border)",
    paddingTop: "var(--space-xs)",
    marginTop: "var(--space-xs)",
    minWidth: 0,
  },
  // One row holding the event and posted dates side by side. flexWrap keeps
  // long dates from escaping the card on narrow screens.
  datesRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-md)",
    minWidth: 0,
  },
  // Wraps everything below the photo. Padding is put on this box (not the
  // article) so the photo can sit flush against the card's top and side
  // edges while the text keeps its own breathing room.
  body: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-xs)",
    padding: "var(--space-md) var(--space-lg) var(--space-lg)",
  },
  title: {
    fontFamily: "var(--font-display), Georgia, serif",
    fontWeight: 700,
    lineHeight: 1.3,
    margin: 0,
    color: "var(--color-text-primary)",
    // Clamped to two lines so cards stay the same height regardless of title
    // length; the full title is on the story's own page.
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
};

// Missing or optional values fall back to an em dash so the layout keeps its
// shape no matter what the row actually holds.
const orDash = (value) => value || "\u2014";

// Posted time shown on every card. A missing or unreadable timestamp falls
// back to an em dash so the card still renders and keeps its height.
const formatPostedDate = (value) => {
  if (!value) return "\u2014";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function EntryCard({
  title,
  description,
  contributor,
  place,
  year,
  created_at,
  photo_url,
  featured = false,
  href,
}) {
  const [hovered, setHovered] = useState(false);

  const titleLinkStyle = {
    color: "inherit",
    textDecoration: hovered ? "underline" : "none",
    textDecorationColor: "var(--color-accent)",
  };

  const articleBase = {
    position: "relative",
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-card)",
    boxShadow: hovered ? "var(--shadow-card-hover)" : "var(--shadow-card)",
    transition: "var(--transition-base)",
    cursor: "default",
  };

  const titleStyle = {
    ...s.title,
    fontSize: featured ? "1.625rem" : "1.25rem",
  };

  // The labelled blocks between the title and the description, in strict
  // top-to-bottom order: author, place, then the event / posted date row.
  const info = (
    <>
      {/* Author */}
      <div style={s.field}>
        <p style={s.label}>CONTRIBUTOR</p>
        <p style={s.value}>{orDash(contributor)}</p>
      </div>

      {/* Place — separated from the author with a subtle divider. */}
      <div style={s.separatedBlock}>
        <p style={s.label}>PLACE</p>
        <p style={s.value}>{orDash(place)}</p>
      </div>

      {/* Event date and posted date together in one row, kept as separate
          data properties (year vs. created_at) so "when it happened" is never
          confused with "when it was submitted". */}
      <div style={s.separatedBlock}>
        <div style={s.datesRow}>
          <div style={s.field}>
            <p style={s.label}>EVENT</p>
            <p style={s.value}>{orDash(year)}</p>
          </div>
          <div style={s.field}>
            <p style={s.label}>POSTED</p>
            <p style={s.value}>{formatPostedDate(created_at)}</p>
          </div>
        </div>
      </div>
    </>
  );

  if (featured) {
    return (
      <article
        style={{
          ...articleBase,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="article"
      >
        {/* The featured story spans the full page width, so the default 4:3
            frame would grow taller than most screens. 16:9 keeps the hero
            proportional while still lifting the photo far above the old fixed
            170px landscape strip. The photo is the first card child with no
            article padding, so it fills the card's top edge-to-edge. */}
        <EntryPhoto photo_url={photo_url} title={title} href={href} ratio="16 / 9" />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            backgroundColor: "var(--color-accent)",
            borderTopLeftRadius: "var(--radius-card)",
            borderBottomLeftRadius: "var(--radius-card)",
          }}
        />
        <div style={s.body}>
          <span style={s.label}>FEATURED</span>
          <h2 style={titleStyle}>
            {href ? <Link href={href} style={titleLinkStyle}>{title}</Link> : title}
          </h2>
          {info}
          {/* Description at the very bottom so the labelled blocks above stay
              in the requested order. */}
          <p style={s.description}>{description}</p>
        </div>
      </article>
    );
  }

  return (
    <article
      style={{
        ...articleBase,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="article"
    >
      {/* No article padding here either, so the photo fills the card's top
          edge-to-edge just like the featured card. */}
      <EntryPhoto photo_url={photo_url} title={title} href={href} />
      <div style={s.body}>
        <h2 style={titleStyle}>
          {href ? <Link href={href} style={titleLinkStyle}>{title}</Link> : title}
        </h2>
        {info}
        {/* Description at the very bottom; clamped to three lines so cards
            keep an even height and the full story stays one click away. */}
        <p style={s.description}>{description}</p>
      </div>
    </article>
  );
}