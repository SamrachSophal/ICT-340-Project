"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/browser.js";
import EntryForm from "./EntryForm.js";
import {
  deleteEntryPhoto,
  uploadEntryPhoto,
} from "../lib/uploadEntryPhoto.js";

export default function EditEntryForm({ entry, user }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async ({ cleaned, photo, removePhoto }) => {
    try {
      // 1. Photo changes are optional:
      //    - a new file replaces the current photo,
      //    - removePhoto clears it (the stored file is deleted after save),
      //    - otherwise the current photo is kept as-is.
      let photoUrl = entry.photo_url;
      if (photo) {
        photoUrl = await uploadEntryPhoto({
          supabase,
          file: photo,
          userId: user.id,
        });
      } else if (removePhoto) {
        photoUrl = null;
      }

      // 2. Update only the columns contributors supply. `owner` is the
      //    account that created the entry and is never changed by an edit;
      //    `contributor` (the credited name) is editable like the rest.
      const row = {
        title: cleaned.title,
        description: cleaned.description,
        place: cleaned.place,
        year: cleaned.year,
        contributor: cleaned.contributor,
      };
      // photo_url is only sent when it changes: a new URL replaces the
      // current one, and removePhoto clears it back to null.
      if (photoUrl) {
        row.photo_url = photoUrl;
      } else if (removePhoto) {
        row.photo_url = null;
      }

      // 3. .select() must hand back the updated row. If none came back,
      //    the change was not actually saved.
      const { data, error: updateError } = await supabase
        .from("entries")
        .update(row)
        .eq("id", entry.id)
        .select()
        .maybeSingle();

      if (updateError) throw updateError;
      if (!data) {
        console.error("Update returned no row for entry", entry.id);
        return "That change wasn't saved";
      }

      // 4. The story no longer points at the old file, so delete the stored
      //    photo too. This is best-effort cleanup: if it fails, the story is
      //    still correct, so the problem is only logged.
      if (removePhoto && entry.photo_url) {
        try {
          await deleteEntryPhoto({ supabase, photoUrl: entry.photo_url });
        } catch (storageError) {
          console.warn("Stored photo could not be deleted:", storageError);
        }
      }

      // 5. Land back on the story.
      router.push(`/entries/${entry.id}`);
      return null;
    } catch (updateError) {
      console.error("Entry update failed:", updateError);
      return "That change wasn't saved";
    }
  };

  return (
    <EntryForm
      initialValues={{
        contributor: entry.contributor,
        title: entry.title,
        description: entry.description,
        place: entry.place,
        year: entry.year,
        photoUrl: entry.photo_url,
      }}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      savingLabel="Saving…"
    />
  );
}