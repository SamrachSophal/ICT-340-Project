"use client";

import { useState } from "react";

const s = {
  number: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.75rem",
    color: "var(--color-text-muted)",
    letterSpacing: "0.08em",
    margin: 0,
  },
  description: {
    fontSize: "0.9375rem",
    color: "var(--color-text-secondary)",
    lineHeight: 1.7,
    margin: 0,
    maxWidth: "65ch",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-xl)",
    paddingTop: "var(--space-md)",
    marginTop: "var(--space-md)",
    borderTop: "1px solid var(--color-border)",
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.6875rem",
    color: "var(--color-text-muted)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: 0,
  },
  value: {
    fontSize: "0.875rem",
    color: "var(--color-text-primary)",
    margin: "4px 0 0",
  },
};

export default function EntryCard({
  title,
  description,
  contributor,
  place,
  index,
  featured = false,
}) {
  const [hovered, setHovered] = useState(false);

  const articleBase = {
    position: "relative",
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-card)",
    boxShadow: hovered ? "var(--shadow-card-hover)" : "var(--shadow-card)",
    transition: "var(--transition-base)",
    cursor: "default",
  };

  if (featured) {
    return (
      <article
        style={{
          ...articleBase,
          padding: "var(--space-xl) var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="article"
      >
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
        <span style={s.number}>
          {String(index).padStart(2, "0")} — FEATURED
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "1.625rem",
            fontWeight: 700,
            lineHeight: 1.3,
            margin: 0,
            color: "var(--color-text-primary)",
          }}
        >
          {title}
        </h2>
        <p style={s.description}>{description}</p>
        <div style={s.meta}>
          <div>
            <p style={s.label}>PLACE</p>
            <p style={s.value}>{place}</p>
          </div>
          <div>
            <p style={s.label}>CONTRIBUTOR</p>
            <p style={s.value}>{contributor}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      style={{
        ...articleBase,
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-sm)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="article"
    >
      <span style={s.number}>
        {String(index).padStart(2, "0")}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "1.25rem",
          fontWeight: 600,
          lineHeight: 1.3,
          margin: 0,
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h2>
      <p style={s.description}>{description}</p>
      <div style={s.meta}>
        <div>
          <p style={s.label}>PLACE</p>
          <p style={s.value}>{place}</p>
        </div>
        <div>
          <p style={s.label}>CONTRIBUTOR</p>
          <p style={s.value}>{contributor}</p>
        </div>
      </div>
    </article>
  );
}
