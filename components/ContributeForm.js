"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/browser.js";
import EntryForm from "./EntryForm.js";
import { uploadEntryPhoto } from "../lib/uploadEntryPhoto.js";

const linkStyle = {
  color: "var(--color-accent)",
  textDecoration: "none",
  borderBottom: "1px solid var(--color-accent)",
  paddingBottom: "2px",
};

export default function ContributeForm({ user }) {
  const supabase = createClient();

  // The contributor box starts pre-filled with the signed-in account's
  // username, but the contributor may change it to credit the actual person
  // who shared the story (for example, an elder telling the memory).
  // Accounts without a username fall back to "Anonymous"; the account's
  // email address is never used as the public contributor name.
  const contributor = user.user_metadata?.username || "Anonymous";

  // Once the insert succeeds, the form is swapped for a review message:
  // the new entry is pending and is not on the public pages yet.
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async ({ cleaned, photo }) => {
    // 1. Upload the optional cover photo, then grab its public URL.
    let photoUrl = null;
    if (photo) {
      try {
        photoUrl = await uploadEntryPhoto({
          supabase,
          file: photo,
          userId: user.id,
        });
      } catch (uploadError) {
        console.error("Cover photo upload failed:", uploadError);
        return "Your photo couldn't be uploaded. Please try again.";
      }
    }

    // 2. Insert exactly the columns contributors supply, plus the
    //    session owner. User input is never spread into the row, and no
    //    status is ever sent: the database default starts every entry as
    //    "pending" until a reviewer publishes it.
    const row = {
      title: cleaned.title,
      description: cleaned.description,
      place: cleaned.place,
      year: cleaned.year,
      owner: user.id,
      contributor: cleaned.contributor,
    };
    if (photoUrl) row.photo_url = photoUrl;

    try {
      const { data, error: insertError } = await supabase
        .from("entries")
        .insert(row)
        .select("id")
        .single();

      if (insertError) throw insertError;

      // 3. Show the review message instead of landing on the entry, which
      //    isn't public yet.
      setSubmitted(true);
      return null;
    } catch (insertError) {
      console.error("Entry insert failed:", insertError);
      return "Something went wrong saving your story. Please try again.";
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        style={{
          padding: "var(--space-2xl) var(--space-lg)",
          backgroundColor: "var(--color-surface)",
          border: "1px dashed var(--color-border-strong)",
          borderRadius: "var(--radius-card)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "1.375rem",
            fontWeight: 600,
            margin: 0,
            color: "var(--color-text-primary)",
          }}
        >
          Thank you!
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            margin: "var(--space-md) 0 0",
            maxWidth: "65ch",
          }}
        >
          Your story has been submitted and is now waiting for review. It
          will appear in the archive once it&rsquo;s published.
        </p>
        <p style={{ margin: "var(--space-lg) 0 0" }}>
          <Link href="/my-entries" style={linkStyle}>
            Track it on My entries →
          </Link>
        </p>
        <p style={{ margin: "var(--space-md) 0 0" }}>
          <Link href="/stories" style={linkStyle}>
            Browse the archive →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <EntryForm
      initialValues={{ contributor }}
      onSubmit={handleSubmit}
      submitLabel="Contribute story"
      savingLabel="Saving…"
    />
  );
}