"use client";

import { useState } from "react";
import FormField from "./FormField.js";
import {
  validateEntry,
  validatePhoto,
  CURRENT_YEAR,
} from "../lib/entryValidation.js";

// ============================================================
//  Shared story form. Both /contribute and /entries/[id]/edit
//  render this same component, so the two flows always show the
//  same fields and enforce the same validation rules.
//
//  Props:
//    initialValues — { title, description, place, year, photoUrl }
//      (photoUrl is the entry's existing cover in edit mode only)
//    submitLabel / savingLabel — text for the submit button.
//    onSubmit({ cleaned, photo }) — async helper that performs the
//      actual save: insert on /contribute, update on /edit. Return a
//      user-facing error message when the save failed, or null on
//      success (the helper is also responsible for navigating away).
//      `cleaned` holds trimmed text values; `photo` is the newly
//      chosen File, or null when none was picked.
// ============================================================

export default function EntryForm({
  initialValues = {},
  submitLabel,
  savingLabel,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialValues.title ?? "");
  const [description, setDescription] = useState(
    initialValues.description ?? "",
  );
  const [place, setPlace] = useState(initialValues.place ?? "");
  const [year, setYear] = useState(
    initialValues.year != null ? String(initialValues.year) : "",
  );
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const hasCurrentPhoto = Boolean(initialValues.photoUrl);

  const photoHint = photo
    ? `Chosen: ${photo.name}${hasCurrentPhoto ? " — will replace the current photo" : ""}.`
    : hasCurrentPhoto
      ? "Current photo will be kept — choose a new file to replace it."
      : "Optional cover photo — JPG, PNG, or WebP, 5 MB or smaller.";

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

    // 2. The caller performs the save. A returned message becomes the
    //    inline form error; null means success.
    const problem = await onSubmit({ cleaned, photo });
    if (problem) setFormError(problem);

    setSaving(false);
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
        {hasCurrentPhoto ? (
          <img
            src={initialValues.photoUrl}
            alt="Current cover photo"
            style={{
              display: "block",
              maxHeight: 180,
              maxWidth: "100%",
              marginBottom: "var(--space-sm)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--color-border)",
            }}
          />
        ) : null}
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
          {photoHint}
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
        {saving ? savingLabel : submitLabel}
      </button>
    </form>
  );
}