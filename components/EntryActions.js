"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/browser.js";

const actionRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-md)",
  alignItems: "center",
  marginTop: "var(--space-xl)",
};

const baseStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  borderRadius: "var(--radius-card)",
  padding: "var(--space-md) var(--space-xl)",
  display: "inline-block",
  textDecoration: "none",
  transition: "var(--transition-base)",
};

const errorStyle = {
  fontSize: "0.875rem",
  color: "var(--color-accent)",
  margin: 0,
  lineHeight: 1.6,
};

// Owned-story actions: an Edit link and a Delete button. The page only
// renders this component for the entry's owner, and Supabase Row Level
// Security is the backstop that blocks any unauthorized write anyway.
export default function EntryActions({ entryId }) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm("Delete this story? This can't be undone.")) return;
    setDeleting(true);
    setError(null);

    try {
      const { data, error: deleteError } = await supabase
        .from("entries")
        .delete()
        .eq("id", entryId)
        .select();

      if (deleteError) throw deleteError;

      // .select() after a delete returns the deleted rows. No rows means
      // nothing was actually removed, so the change wasn't saved.
      if (!data || data.length === 0) {
        console.error("Delete returned no rows for entry", entryId);
        setError("That change wasn't saved");
        setDeleting(false);
        return;
      }

      router.push("/stories");
    } catch (deleteError) {
      console.error("Entry delete failed:", deleteError);
      setError("That change wasn't saved");
      setDeleting(false);
    }
  };

  return (
    <div style={actionRowStyle}>
      <Link
        href={`/entries/${entryId}/edit`}
        style={{
          ...baseStyle,
          color: "#FFFFFF",
          backgroundColor: "var(--color-accent)",
          border: "1px solid var(--color-accent)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-accent)";
        }}
      >
        Edit
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        style={{
          ...baseStyle,
          color: "var(--color-accent)",
          backgroundColor: "transparent",
          border: "1px solid var(--color-accent)",
          cursor: deleting ? "not-allowed" : "pointer",
          opacity: deleting ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!deleting) e.currentTarget.style.color = "#FFFFFF";
          if (!deleting)
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
        }}
        onMouseLeave={(e) => {
          if (!deleting) e.currentTarget.style.color = "var(--color-accent)";
          if (!deleting)
            e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>

      {error && (
        <p role="alert" style={errorStyle}>
          {error}
        </p>
      )}
    </div>
  );
}