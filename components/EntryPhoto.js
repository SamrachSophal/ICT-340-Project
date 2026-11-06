import Link from "next/link";

// Photo area shown at the top of every entry card. The frame is shaped by an
// aspect ratio instead of the old fixed 170px height, so it is noticeably
// taller — no more pure-landscape strip — and gives portrait photos room to
// be seen. The ratio keeps every card the same shape with or without a
// picture, so cards in a grid keep equal height. With a photo the cover crop
// fills the box; the full, uncropped image is shown on the story's own page.
// Clicking the frame opens the story.

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

export default function EntryPhoto({ photo_url, title, href, ratio = "4 / 3" }) {
  // Shaped inside the component rather than at module level so callers can
  // pass their own ratio — the full-width featured card uses a wider frame.
  const frameStyle = {
    aspectRatio: ratio,
    borderRadius: "var(--radius-card)",
    overflow: "hidden",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-surface-hover)",
    display: "block",
    textDecoration: "none",
    position: "relative",
  };

  const content = photo_url ? (
    <img
      src={photo_url}
      alt={title}
      loading="lazy"
      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
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