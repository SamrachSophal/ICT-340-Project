"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/browser.js";
import FormField from "./FormField.js";
import {
  validateEntry,
  validatePhoto,
  CURRENT_YEAR,
} from "../lib/entryValidation.js";
import { uploadEntryPhoto } from "../lib/uploadEntryPhoto.js";

export default function ContributeForm({ user }) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [year, setYear] = useState("");
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  // The contributor is the logged-in session user — never a form field.
  const contributor = user.user_metadata?.full_name || user.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    // 1. Validate every field; validateEntry trims all text first.
    const { errors: fieldErrors, cleaned } = validateEntry({
      title,
      description,
      place,
      year,
    });
    const photoError = validatePhoto(photo);
    if (photoError) fieldErrors.photo = photoError;
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSaving(true);

    // 2. Upload the optional cover photo, then grab its public URL.
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
        setFormError("Your photo couldn't be uploaded. Please try again.");
        setSaving(false);
        return;
      }
    }

    // 3. Insert exactly the columns contributors supply, plus the
    //    session owner. User input is never spread into the row.
    const row = {
      title: cleaned.title,
      description: cleaned.description,
      place: cleaned.place,
      year: cleaned.year,
      owner: user.id,
      contributor,
    };
    if (photoUrl) row.photo_url = photoUrl;

    try {
      const { data, error: insertError } = await supabase
        .from("entries")
        .insert(row)
        .select("id")
        .single();

      if (insertError) throw insertError;

      // 4. Land on the new entry.
      router.push(`/entries/${data.id}`);
    } catch (insertError) {
      console.error("Entry insert failed:", insertError);
      setFormError("Something went wrong saving your story. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
        maxWidth: 640,
      }}
    >
      <FormField label="Title" htmlFor="title" error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={100}
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="search-input"
          placeholder="A short headline for this memory"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={6}
          maxLength={3000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="search-input"
          placeholder="Tell the memory — what happened, who was there, what made it a tradition."
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
      </FormField>

      <FormField label="Place" htmlFor="place" error={errors.place}>
        <input
          id="place"
          name="place"
          type="text"
          maxLength={60}
          autoComplete="off"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="search-input"
          placeholder="Where did it happen?"
          aria-invalid={errors.place ? true : undefined}
          aria-describedby={errors.place ? "place-error" : undefined}
        />
      </FormField>

      <FormField label="Year" htmlFor="year" error={errors.year}>
        <input
          id="year"
          name="year"
          type="number"
          min={1901}
          max={CURRENT_YEAR}
          step={1}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="search-input"
          placeholder={`e.g. ${CURRENT_YEAR}`}
          aria-invalid={errors.year ? true : undefined}
          aria-describedby={errors.year ? "year-error" : undefined}
        />
      </FormField>

      <FormField label="Photo (optional)" htmlFor="photo" error={errors.photo}>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          className="search-input"
          aria-invalid={errors.photo ? true : undefined}
          aria-describedby={errors.photo ? "photo-error" : undefined}
        />
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-muted)",
            margin: "var(--space-sm) 0 0",
            lineHeight: 1.5,
          }}
        >
          {photo
            ? `Chosen: ${photo.name}`
            : "Optional cover photo — JPG, PNG, or WebP, 5 MB or smaller."}
        </p>
      </FormField>

      {formError && (
        <p
          role="alert"
          style={{
            fontSize: "0.875rem",
            color: "var(--color-accent)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {formError}
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
          if (!saving) e.target.style.backgroundColor = "var(--color-accent-hover)";
        }}
        onMouseLeave={(e) => {
          if (!saving) e.target.style.backgroundColor = "var(--color-accent)";
        }}
      >
        {saving ? "Saving…" : "Contribute story"}
      </button>
    </form>
  );
}