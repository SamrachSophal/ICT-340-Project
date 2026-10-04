import Link from "next/link";
import { createClient } from "../../lib/supabase/server.js";
import ContributeForm from "../../components/ContributeForm.js";

export default async function ContributePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "var(--space-2xl) var(--space-lg)" }}>
      <p
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.75rem",
          color: "var(--color-accent)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        The Diary
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          margin: "var(--space-md) 0 var(--space-sm)",
          color: "var(--color-text-primary)",
        }}
      >
        Contribute a story
      </h1>

      {user ? (
        <>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              margin: "0 0 var(--space-2xl)",
              maxWidth: "65ch",
            }}
          >
            Share a memory from a family gathering so it becomes part of the living archive.
          </p>
          <ContributeForm user={user} />
        </>
      ) : (
        <>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "65ch",
            }}
          >
            You need to be logged in to add a story to the archive.
          </p>
          <p
            style={{
              marginTop: "var(--space-xl)",
              fontSize: "0.9375rem",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            <Link
              href="/login"
              style={{
                color: "var(--color-accent)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-accent)",
                paddingBottom: "2px",
              }}
            >
              Log in to contribute →
            </Link>
          </p>
        </>
      )}

      <footer
        style={{
          marginTop: "var(--space-3xl)",
          paddingTop: "var(--space-lg)",
          borderTop: "1px solid var(--color-border)",
          fontSize: "0.8125rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}
      >
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026.
      </footer>
    </main>
  );
}