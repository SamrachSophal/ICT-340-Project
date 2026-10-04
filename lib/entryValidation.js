// ============================================================
//  Validation rules for the contribute form.
//  Every rule has a short, actionable message that is shown
//  next to the field when the rule fails.
//
//  All text fields are trimmed before their length is checked,
//  and the cleaned (trimmed) values are what gets inserted.
// ============================================================

export const CURRENT_YEAR = new Date().getFullYear();

export const PHOTO_RULES = {
  // Optional cover photo: allowlisted types only, max 5 MB.
  maxBytes: 5 * 1024 * 1024,
  extensions: ["jpg", "jpeg", "png", "webp"],
};

/**
 * Validates the text fields of an entry.
 * Returns { errors, cleaned } where `errors` maps each field to a
 * short message and `cleaned` holds the trimmed values to insert.
 */
export function validateEntry(values) {
  const errors = {};
  const cleaned = {};

  const title = (values.title ?? "").trim();
  cleaned.title = title;
  if (!title) {
    errors.title = "Please enter a title.";
  } else if (title.length < 5 || title.length > 100) {
    errors.title = "Title must be between 5 and 100 characters.";
  } else if (/[<>]/.test(title)) {
    errors.title = "Please don't include < or > in this field.";
  }

  const description = (values.description ?? "").trim();
  cleaned.description = description;
  if (!description) {
    errors.description = "Please enter a description.";
  } else if (description.length < 20 || description.length > 3000) {
    errors.description = "Description must be between 20 and 3000 characters.";
  } else if (/[<>]/.test(description)) {
    errors.description = "Please don't include < or > in this field.";
  }

  const place = (values.place ?? "").trim();
  cleaned.place = place;
  if (!place) {
    errors.place = "Please enter a place.";
  } else if (place.length < 2 || place.length > 60) {
    errors.place = "Place must be between 2 and 60 characters.";
  } else if (/[<>]/.test(place)) {
    errors.place = "Please don't include < or > in this field.";
  }

  const yearText = (values.year ?? "").trim();
  const year = Number(yearText);
  if (!yearText) {
    errors.year = "Please enter a year.";
  } else if (!/^\d{4}$/.test(yearText) || year < 1901 || year > CURRENT_YEAR) {
    errors.year = `Year must be between 1901 and ${CURRENT_YEAR}.`;
  } else {
    cleaned.year = year;
  }

  return { errors, cleaned };
}

/**
 * Validates the optional cover photo File.
 * Returns a short message when the file is rejected, or null when
 * it is fine (or when no file was chosen).
 */
export function validatePhoto(file) {
  if (!file) return null;

  const dot = file.name.lastIndexOf(".");
  const ext = dot === -1 ? "" : file.name.slice(dot + 1).toLowerCase();

  if (!PHOTO_RULES.extensions.includes(ext)) {
    return "Photo must be a JPG, PNG, or WebP image.";
  }
  if (!file.type || !file.type.startsWith("image/")) {
    return "Photo must be a JPG, PNG, or WebP image.";
  }
  if (file.size > PHOTO_RULES.maxBytes) {
    return "Photo must be 5 MB or smaller.";
  }
  return null;
}