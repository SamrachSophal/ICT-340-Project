import Link from "next/link";
import { createClient } from "../../lib/supabase/server.js";

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

// Each status stored in the database is shown here in plain words, in
// Khmer and English: the archive's entries are bilingual.
const STATUS_WORDS = {
  pending: "Pending · ការពិនិត្យ",
  published: "Published · បានផ្សាយ",
  returned: "Returned · បានផ្ញើត្រឡប់",
};

// A signed-in user's own stories, in every status: pending ones are waiting
// for review, published ones are public, returned ones were sent back for a
// change. Row Level Security only ever hands back rows this account owns.
export default async function MyEntriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main style={mainStyle}>
        <p style={eyebrowStyle}>The Diary</p>
        <h1 style={h1Style}>Log in to see your entries</h1>
        <p style={bodyStyle}>
          You need to be logged in to see the stories you&rsquo;ve
          contributed.{" "}
          <Link href="/login" style={linkStyle}>
            Log in →
          </Link>
        </p>
        <footer style={footerStyle}>
          Built in ICT 340 — Vibe Coding, American University of Phnom Penh,
          Fall 2026.
        </footer>
      </main>
    );
  }

  // Only rows this account owns come back, whatever their status.
  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("owner", user.id)
    .order("year", { ascending: false });

  const list = entries || [];

  return (
    <main style={mainStyle}>
      <p style={eyebrowStyle}>The Diary</p>
      <h1 style={h1Style}>My entries</h1>

      {list.length === 0 ? (
        <p style={bodyStyle}>
          You haven&rsquo;t contributed a story yet.{" "}
          <Link href="/contribute" style={linkStyle}>
            Contribute a story →
          </Link>
        </p>
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
            <li
              key={entry.id}
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-lg)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--color-text-primary)",
                }}
              >
                <Link
                  href={`/entries/${entry.id}`}
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--color-accent)",
                  }}
                >
                  {entry.title}
                </Link>
              </h2>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-muted)",
                  margin: "var(--space-sm) 0 0",
                }}
              >
                {entry.year} · {entry.contributor}
              </p>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-secondary)",
                  margin: "var(--space-sm) 0 0",
                }}
              >
                Status: {STATUS_WORDS[entry.status] ?? entry.status}
              </p>
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