import Link from "next/link";

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
  margin: "var(--space-md) 0 var(--space-sm)",
  color: "var(--color-text-primary)",
};

const bodyStyle = {
  fontSize: "1.0625rem",
  color: "var(--color-text-secondary)",
  lineHeight: 1.8,
  margin: 0,
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

// Landing page shown after the email confirmation link is clicked and the
// account has been verified by /auth/confirm. Reached from the production
// site's own URL, so the email never sends users to localhost.
export default function AccountCreatedPage() {
  return (
    <main style={mainStyle}>
      <p style={eyebrowStyle}>Account</p>
      <h1 style={h1Style}>Account created</h1>
      <p style={bodyStyle}>
        Your account has been successfully created. You&rsquo;re signed in and
        ready to share your family&rsquo;s stories with the archive — try an
        entry in Khmer or English.
      </p>

      <p style={{ margin: "var(--space-xl) 0 0" }}>
        <Link href="/contribute" style={linkStyle}>
          Contribute a story →
        </Link>
      </p>
      <p style={{ margin: "var(--space-md) 0 0" }}>
        <Link href="/stories" style={linkStyle}>
          Browse the archive →
        </Link>
      </p>

      <footer style={footerStyle}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026.
      </footer>
    </main>
  );
}
