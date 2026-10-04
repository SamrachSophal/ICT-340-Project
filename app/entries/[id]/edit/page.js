import Link from "next/link";
import { createClient } from "../../../../lib/supabase/server.js";
import EditEntryForm from "../../../../components/EditEntryForm.js";

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

const bodyStyle = {
  fontSize: "1.0625rem",
  color: "var(--color-text-secondary)",
  lineHeight: 1.8,
  margin: 0,
  maxWidth: "65ch",
};

const footerStyle = {
  marginTop: "var(--space-3xl)",
  paddingTop: "var(--space-lg)",
  borderTop: "1px solid var(--color-border)",
  fontSize: "0.8125rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.6,
};

export default async function EditEntryPage({ params }) {
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

  let heading = "Edit story";
  let body = null;

  if (error || !entry) {
    heading = "Story not found";
    body = (
      <p style={bodyStyle}>
        This story doesn&rsquo;t exist or isn&rsquo;t available yet.{" "}
        <Link href="/stories" style={linkStyle}>
          ← All stories
        </Link>
      </p>
    );
  } else if (!user) {
    heading = "Log in to edit";
    body = (
      <p style={bodyStyle}>
        You need to be logged in to edit a story.{" "}
        <Link href="/login" style={linkStyle}>
          Log in →
        </Link>
      </p>
    );
  } else if (entry.owner !== user.id) {
    heading = "Not your story";
    body = (
      <p style={bodyStyle}>
        You can only edit stories you contributed.{" "}
        <Link href={`/entries/${entry.id}`} style={linkStyle}>
          ← Back to the story
        </Link>
      </p>
    );
  } else {
    // Only the owner reaches the pre-filled form.
    body = <EditEntryForm entry={entry} user={user} />;
  }

  return (
    <main style={mainStyle}>
      <p style={eyebrowStyle}>The Diary</p>
      <p style={{ margin: "0 0 var(--space-sm)" }}>
        <Link href="/stories" style={linkStyle}>
          ← All stories
        </Link>
      </p>
      <h1 style={h1Style}>{heading}</h1>
      {body}
      <footer style={footerStyle}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026.
      </footer>
    </main>
  );
}