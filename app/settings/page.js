import Link from "next/link";
import { createClient } from "../../lib/supabase/server.js";
import UsernameForm from "../../components/UsernameForm.js";

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

// The username is what appears as the contributor on stories an account adds
// and as the account's label in the navbar. This page is only reachable by
// the signed-in owner, so it can offer the editable form (never the email).
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={mainStyle}>
      <p style={eyebrowStyle}>Account</p>
      <h1 style={h1Style}>Settings</h1>

      {user ? (
        <>
          <p style={bodyStyle}>
            Your username is the public name shown under CONTRIBUTOR on the
            stories you add. Accounts without a username appear as
            &ldquo;Anonymous&rdquo;.
          </p>
          <UsernameForm
            currentUsername={(user.user_metadata?.username ?? "").trim()}
          />
        </>
      ) : (
        <p style={bodyStyle}>
          You need to be logged in to change your username.{" "}
          <Link href="/login" style={linkStyle}>
            Log in →
          </Link>
        </p>
      )}

      <footer style={footerStyle}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026.
      </footer>
    </main>
  );
}
