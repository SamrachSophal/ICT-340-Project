import Link from "next/link";

// Fixed-size photo area shown at the top of every entry card. The frame keeps
// the exact same dimensions with or without a picture, so cards in a grid keep
// equal height. With a photo the cover crop fills the box; the full, uncropped
// image is shown on the story's own page. Clicking the frame opens the story.

const frameStyle = {
  height: 170,
  borderRadius: "var(--radius-card)",
  overflow: "hidden",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-surface-hover)",
  display: "block",
  textDecoration: "none",
  position: "relative",
};

const placeholderStyle = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Courier New', monospace",
  fontSize: "0.6875rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-text-muted)",
  margin: 0,
};

export default function EntryPhoto({ photo_url, title, href }) {
  const content = photo_url ? (
    <img
      src={photo_url}
      alt={title}
      loading="lazy"
      style={{ display: "block", width: "100%", height: 170, objectFit: "cover" }}
    />
  ) : (
    <p style={placeholderStyle}>No photo</p>
  );

  return href ? (
    <Link href={href} aria-label={`Open story: ${title}`} style={frameStyle}>
      {content}
    </Link>
  ) : (
    <div style={frameStyle}>{content}</div>
  );
}