import Link from "next/link";
import { createClient } from "../../../lib/supabase/server.js";
import EntryActions from "../../../components/EntryActions.js";

const mainStyle = {
  maxWidth: 840,
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
  margin: "var(--space-md) 0 var(--space-sm)",
  color: "var(--color-text-primary)",
};

const linkStyle = {
  color: "var(--color-accent)",
  textDecoration: "none",
  borderBottom: "1px solid var(--color-accent)",
  paddingBottom: "2px",
};

const descStyle = {
  fontSize: "1.0625rem",
  color: "var(--color-text-secondary)",
  lineHeight: 1.8,
  margin: "var(--space-lg) 0 0",
  maxWidth: "65ch",
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

const metaStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-xl)",
  paddingTop: "var(--space-md)",
  marginTop: "var(--space-lg)",
  borderTop: "1px solid var(--color-border)",
};

const footerStyle = {
  marginTop: "var(--space-3xl)",
  paddingTop: "var(--space-lg)",
  borderTop: "1px solid var(--color-border)",
  fontSize: "0.8125rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.6,
};

export default async function EntryPage({ params }) {
  // Next.js 15 passes dynamic route params as a Promise.
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Edit and Delete are only offered to the person who owns the story.
  const isOwner = user && entry && entry.owner === user.id;

  if (error || !entry) {
    return (
      <main style={mainStyle}>
        <p style={eyebrowStyle}>The Diary</p>
        <h1 style={h1Style}>Story not found</h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: "65ch",
          }}
        >
          This story doesn&rsquo;t exist or isn&rsquo;t available yet.
        </p>
        <p style={{ marginTop: "var(--space-xl)" }}>
          <Link href="/stories" style={linkStyle}>
            ← All stories
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <p style={eyebrowStyle}>The Diary</p>
      <p style={{ margin: "0 0 var(--space-sm)" }}>
        <Link href="/stories" style={linkStyle}>
          ← All stories
        </Link>
      </p>
      <h1 style={h1Style}>{entry.title}</h1>

      {entry.photo_url ? (
        <img
          src={entry.photo_url}
          alt={`Cover photo for ${entry.title}`}
          style={{
            display: "block",
            maxWidth: "100%",
            marginTop: "var(--space-lg)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
          }}
        />
      ) : null}

      <p style={descStyle}>{entry.description}</p>

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
      </div>

      {isOwner ? <EntryActions entryId={entry.id} /> : null}

      <footer style={footerStyle}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026.
      </footer>
    </main>
  );
}