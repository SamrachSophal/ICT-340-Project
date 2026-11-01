import { createClient } from "../../lib/supabase/server.js";
import ReviewActions from "../../components/ReviewActions.js";

const mainStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "var(--space-2xl) var(--space-lg)",
};

const eyebrowStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.75rem",
  color: "var(--color-accent)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: 0,
};

const h1Style = {
  fontFamily: "var(--font-display), Georgia, serif",
  fontSize: "clamp(2rem, 5vw, 3.5rem)",
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  margin: "var(--space-md) 0 var(--space-lg)",
  color: "var(--color-text-primary)",
};

const bodyStyle = {
  fontSize: "1.0625rem",
  color: "var(--color-text-secondary)",
  lineHeight: 1.8,
  margin: "0 0 var(--space-2xl)",
  maxWidth: "65ch",
};

const linkStyle = {
  color: "var(--color-accent)",
  textDecoration: "none",
  borderBottom: "1px solid var(--color-accent)",
  paddingBottom: "2px",
};

const footerStyle = {
  marginTop: "var(--space-3xl)",
  paddingTop: "var(--space-lg)",
  borderTop: "1px solid var(--color-border)",
  fontSize: "0.8125rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.6,
};

const cardStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  padding: "var(--space-lg)",
};

const cardTitleStyle = {
  fontFamily: "var(--font-display), Georgia, serif",
  fontSize: "1.25rem",
  fontWeight: 600,
  margin: 0,
  color: "var(--color-text-primary)",
};

const descriptionStyle = {
  fontSize: "1rem",
  color: "var(--color-text-secondary)",
  lineHeight: 1.8,
  margin: "var(--space-md) 0 0",
  maxWidth: "65ch",
};

const figureStyle = {
  margin: "var(--space-md) 0 0",
  maxWidth: 480,
};

const photoStyle = {
  display: "block",
  width: "100%",
  height: 240,
  objectFit: "cover",
  borderRadius: "var(--radius-card)",
  border: "1px solid var(--color-border)",
};

const captionStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-text-muted)",
  margin: "var(--space-sm) 0 0",
};

const metaStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-xl)",
  paddingTop: "var(--space-md)",
  marginTop: "var(--space-lg)",
  borderTop: "1px solid var(--color-border)",
};

const labelStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.6875rem",
  color: "var(--color-text-muted)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: 0,
};

const valueStyle = {
  fontSize: "0.875rem",
  color: "var(--color-text-primary)",
  margin: "4px 0 0",
};

// Submitted time shown on each queue card. A missing or unreadable
// timestamp falls back to an em dash so the card still renders.
const formatSubmittedDate = (value) => {
  if (!value) return "\u2014";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// The review queue: every pending entry, oldest first, each with Publish
// and Return. The is_reviewer check runs before any query, so a visitor
// who is not a reviewer never sees (or even fetches) the queue.
export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: isReviewer } = await supabase.rpc("is_reviewer");

  if (isReviewer !== true) {
    return (
      <main style={mainStyle}>
        <p style={eyebrowStyle}>Review</p>
        <h1 style={h1Style}>Review queue</h1>
        <p style={bodyStyle}>This page is for reviewers only.</p>
        <footer style={footerStyle}>
          Built in ICT 340 — Vibe Coding, American University of Phnom Penh,
          Fall 2026.
        </footer>
      </main>
    );
  }

  // Oldest first: the entry that has waited longest sits at the top.
  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const list = entries || [];

  return (
    <main style={mainStyle}>
      <p style={eyebrowStyle}>Review</p>
      <h1 style={h1Style}>Review queue</h1>

      {list.length === 0 ? (
        <div
          role="status"
          style={{
            padding: "var(--space-2xl) var(--space-lg)",
            backgroundColor: "var(--color-surface)",
            border: "1px dashed var(--color-border-strong)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            Nothing waiting for review
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              margin: "var(--space-sm) 0 0",
              lineHeight: 1.6,
            }}
          >
            New submissions will appear here, oldest first.
          </p>
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          {list.map((entry) => (
            <li key={entry.id} style={cardStyle}>
              <h2 style={cardTitleStyle}>{entry.title}</h2>

              {entry.photo_url ? (
                <figure style={figureStyle}>
                  <a
                    href={entry.photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={entry.photo_url}
                      alt={`Cover photo for ${entry.title}`}
                      style={photoStyle}
                    />
                  </a>
                  <figcaption style={captionStyle}>
                    <a
                      href={entry.photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={linkStyle}
                    >
                      View full size ↗
                    </a>
                  </figcaption>
                </figure>
              ) : null}

              <p style={descriptionStyle}>{entry.description}</p>

              <div style={metaStyle}>
                <div>
                  <p style={labelStyle}>PLACE</p>
                  <p style={valueStyle}>{entry.place}</p>
                </div>
                <div>
                  <p style={labelStyle}>YEAR</p>
                  <p style={valueStyle}>{entry.year}</p>
                </div>
                <div>
                  <p style={labelStyle}>CONTRIBUTOR</p>
                  <p style={valueStyle}>{entry.contributor}</p>
                </div>
                <div>
                  <p style={labelStyle}>SUBMITTED</p>
                  <p style={valueStyle}>{formatSubmittedDate(entry.created_at)}</p>
                </div>
              </div>

              <ReviewActions entryId={entry.id} />
            </li>
          ))}
        </ul>
      )}

      <footer style={footerStyle}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh,
        Fall 2026.
      </footer>
    </main>
  );
}
