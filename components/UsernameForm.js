"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/browser.js";
import FormField from "./FormField.js";

// Settings form that changes the username stored in the account's user
// metadata. That username is the default contributor name on the contribute
// form and the label shown in the nav bar. Same validation rules as the
// signup form; the account's email address is never displayed publicly.
export default function UsernameForm({ currentUsername }) {
  const supabase = createClient();
  const [username, setUsername] = useState(currentUsername ?? "");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const inputStyle = {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const cleaned = username.trim();
    if (!cleaned) {
      setError("Please enter a username.");
      return;
    }
    if (cleaned.length < 2 || cleaned.length > 50) {
      setError("Username must be between 2 and 50 characters.");
      return;
    }
    if (/[<>]/.test(cleaned)) {
      setError("Username can't include < or >.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { username: cleaned },
    });

    setSaving(false);

    if (updateError) {
      console.error("Username update failed:", updateError);
      setError("Unable to update your username. Please try again.");
      return;
    }

    setMessage("Username updated — new stories will be credited to this name.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
        maxWidth: 400,
      }}
    >
      <FormField label="Username" htmlFor="username" error={error}>
        <input
          id="username"
          type="text"
          autoComplete="username"
          required
          maxLength={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="search-input"
          style={inputStyle}
          placeholder="Your public username"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "username-error" : undefined}
        />
      </FormField>

      {message && (
        <p
          role="status"
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-secondary)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: saving ? "var(--color-text-muted)" : "#FFFFFF",
          backgroundColor: saving ? "var(--color-border)" : "var(--color-accent)",
          border: "none",
          borderRadius: "var(--radius-card)",
          padding: "var(--space-md) var(--space-xl)",
          cursor: saving ? "not-allowed" : "pointer",
          transition: "var(--transition-base)",
          alignSelf: "flex-start",
          opacity: saving ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!saving)
            e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
        }}
        onMouseLeave={(e) => {
          if (!saving)
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
        }}
      >
        {saving ? "Saving…" : "Save username"}
      </button>
    </form>
  );
}
