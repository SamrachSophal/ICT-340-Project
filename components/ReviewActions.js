"use client";

import { useState } from "react";
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
  cursor: "pointer",
};

const errorStyle = {
  fontSize: "0.875rem",
  color: "var(--color-accent)",
  margin: 0,
  lineHeight: 1.6,
};

// Review-queue actions: Publish and Return. Both go through the
// review_entry database function — the page never updates the entries
// table directly. The function returns true when the decision was
// applied, false when it was refused, and the RPC itself errors when
// the call is malformed. Only a true return removes the entry.
export default function ReviewActions({ entryId }) {
  const router = useRouter();
  const supabase = createClient();
  const [decision, setDecision] = useState(null);
  const [error, setError] = useState(null);

  const handleReview = async (nextDecision) => {
    setDecision(nextDecision);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc("review_entry", {
        entry_id: entryId,
        decision: nextDecision,
      });

      if (rpcError) throw rpcError;

      // False means the database declined the change (for example, the
      // entry was already handled). Leave the entry where it is.
      if (data !== true) {
        console.error("review_entry refused for entry", entryId);
        setError("That change wasn't saved");
        setDecision(null);
        return;
      }

      // The entry is no longer pending, so re-running the server page
      // drops it out of the queue.
      router.refresh();
    } catch (reviewError) {
      console.error("review_entry failed:", reviewError);
      setError("That change wasn't saved");
      setDecision(null);
    }
  };

  return (
    <div style={actionRowStyle}>
      <button
        type="button"
        onClick={() => handleReview("published")}
        disabled={decision !== null}
        style={{
          ...baseStyle,
          color: "#FFFFFF",
          backgroundColor: "var(--color-accent)",
          border: "1px solid var(--color-accent)",
          cursor: decision !== null ? "not-allowed" : "pointer",
          opacity: decision === "published" ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (decision === null)
            e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
        }}
        onMouseLeave={(e) => {
          if (decision === null)
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
        }}
      >
        {decision === "published" ? "Publishing…" : "Publish · ផ្សាយ"}
      </button>

      <button
        type="button"
        onClick={() => handleReview("returned")}
        disabled={decision !== null}
        style={{
          ...baseStyle,
          color: "var(--color-accent)",
          backgroundColor: "transparent",
          border: "1px solid var(--color-accent)",
          cursor: decision !== null ? "not-allowed" : "pointer",
          opacity: decision === "returned" ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (decision === null) {
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
          }
        }}
        onMouseLeave={(e) => {
          if (decision === null) {
            e.currentTarget.style.color = "var(--color-accent)";
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {decision === "returned" ? "Returning…" : "Return · ផ្ញើត្រឡប់"}
      </button>

      {error && (
        <p role="alert" style={errorStyle}>
          {error}
        </p>
      )}
    </div>
  );
}