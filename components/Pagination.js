"use client";

import Link from "next/link";

// One shared look for every control in the bar: small uppercase monospace
// characters, mirroring the archive's label styling elsewhere. Links keep
// their hover accent; the current page and the disabled ends stay flat.
const control = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 32,
  padding: "0 var(--space-md)",
  minWidth: 32,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  backgroundColor: "var(--color-surface)",
  color: "var(--color-text-secondary)",
  textDecoration: "none",
  transition: "var(--transition-base)",
};

// Prev/Next keep their word-length padding; page numbers collapse to squares
// so the row of cells reads evenly.
const wordStyle = { ...control };
const numberStyle = { ...control, padding: 0 };

// The archive relies on :focus-visible for keyboard outlines, but inline
// styles cannot express it, so the ring is painted on focus exactly like
// ThemeToggle does for its button.
const focusRing = (e) => {
  e.currentTarget.style.outline = "2px solid var(--color-focus)";
  e.currentTarget.style.outlineOffset = "2px";
};
const blurRing = (e) => {
  e.currentTarget.style.outline = "none";
  e.currentTarget.style.outlineOffset = "0px";
};

// Clearing the strings returns the link to its default style-object colors.
const hoverIn = (e) => {
  e.currentTarget.style.borderColor = "var(--color-accent)";
  e.currentTarget.style.color = "var(--color-accent)";
};
const hoverOut = (e) => {
  e.currentTarget.style.borderColor = "";
  e.currentTarget.style.color = "";
};

export default function Pagination({ currentPage, totalPages, buildHref }) {
  // A single page of results needs no navigation section at all.
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_v, i) => i + 1);
  const atFirst = currentPage === 1;
  const atLast = currentPage === totalPages;

  return (
    <nav
      aria-label="Stories pages"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-sm)",
        marginTop: "var(--space-2xl)",
        flexWrap: "wrap",
      }}
    >
      {atFirst ? (
        <span aria-disabled="true" style={{ ...wordStyle, color: "var(--color-text-muted)" }}>
          Prev
        </span>
      ) : (
        <Link href={buildHref(currentPage - 1)} onFocus={focusRing} onBlur={blurRing} onMouseEnter={hoverIn} onMouseLeave={hoverOut} style={wordStyle}>
          Prev
        </Link>
      )}

      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            style={{
              ...numberStyle,
              backgroundColor: "var(--color-accent)",
              borderColor: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            {page}
          </span>
        ) : (
          <Link key={page} href={buildHref(page)} onFocus={focusRing} onBlur={blurRing} onMouseEnter={hoverIn} onMouseLeave={hoverOut} style={numberStyle}>
            {page}
          </Link>
        )
      )}

      {atLast ? (
        <span aria-disabled="true" style={{ ...wordStyle, color: "var(--color-text-muted)" }}>
          Next
        </span>
      ) : (
        <Link href={buildHref(currentPage + 1)} onFocus={focusRing} onBlur={blurRing} onMouseEnter={hoverIn} onMouseLeave={hoverOut} style={wordStyle}>
          Next
        </Link>
      )}
    </nav>
  );
}
