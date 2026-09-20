"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/browser.js";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Invalid email or password");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
  };

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
        Account
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          margin: "var(--space-md) 0 var(--space-lg)",
          color: "var(--color-text-primary)",
        }}
      >
        Log in
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)",
          maxWidth: 400,
        }}
      >
<div>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-sm)",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-input"
            style={{
              width: "100%",
              padding: "var(--space-md) var(--space-lg)",
              fontFamily: "inherit",
              fontSize: "1rem",
              lineHeight: 1.5,
              color: "var(--color-text-primary)",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
              transition: "var(--transition-base)",
            }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-sm)",
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="search-input"
            style={{
              width: "100%",
              padding: "var(--space-md) var(--space-lg)",
              fontFamily: "inherit",
              fontSize: "1rem",
              lineHeight: 1.5,
              color: "var(--color-text-primary)",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
              transition: "var(--transition-base)",
            }}
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p
            role="alert"
            style={{
              fontSize: "0.875rem",
              color: "var(--color-accent)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: loading ? "var(--color-text-muted)" : "#FFFFFF",
            backgroundColor: loading ? "var(--color-border)" : "var(--color-accent)",
            border: "none",
            borderRadius: "var(--radius-card)",
            padding: "var(--space-md) var(--space-xl)",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "var(--transition-base)",
            alignSelf: "flex-start",
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = "var(--color-accent-hover)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = "var(--color-accent)";
          }}
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
          marginTop: "var(--space-xl)",
          lineHeight: 1.6,
        }}
      >
        Don&rsquo;t have an account?{" "}
        <Link
          href="/signup"
          style={{
            color: "var(--color-accent)",
            textDecoration: "none",
            borderBottom: "1px solid var(--color-accent)",
            paddingBottom: "2px",
          }}
        >
          Sign up
        </Link>
      </p>

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