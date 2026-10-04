// ============================================================
//  Uploads the optional cover photo to Supabase Storage.
//  Bucket: photos   Path: <user id>/<random uuid>.<extension>
//  Returns the public URL of the uploaded file.
//
//  The file is validated again here instead of trusting the
//  form's earlier check, and the storage path is built from a
//  random name so the user's filename never reaches the bucket
//  (OWASP upload guidance: never trust or re-use user-supplied
//  filenames; the bucket policy is what enforces the owner).
// ============================================================

import { validatePhoto } from "./entryValidation.js";

export async function uploadEntryPhoto({ supabase, file, userId }) {
  // Defense in depth: reject anything the form check would have missed.
  const photoError = validatePhoto(file);
  if (photoError) {
    throw new Error(photoError);
  }

  const dot = file.name.lastIndexOf(".");
  const ext = file.name.slice(dot + 1).toLowerCase();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const options = { upsert: false };
  if (file.type) options.contentType = file.type;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, options);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}