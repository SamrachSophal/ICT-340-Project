"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/browser.js";
import EntryForm from "./EntryForm.js";
import { uploadEntryPhoto } from "../lib/uploadEntryPhoto.js";

export default function EditEntryForm({ entry, user }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async ({ cleaned, photo }) => {
    try {
      // 1. Changing the photo is optional: upload a new one only when
      //    a file was actually picked. Otherwise keep the existing one.
      let photoUrl = entry.photo_url;
      if (photo) {
        photoUrl = await uploadEntryPhoto({
          supabase,
          file: photo,
          userId: user.id,
        });
      }

      // 2. Update only the columns contributors supply. `owner` and
      //    `contributor` are set at creation and never changed by an edit.
      const row = {
        title: cleaned.title,
        description: cleaned.description,
        place: cleaned.place,
        year: cleaned.year,
      };
      if (photoUrl) row.photo_url = photoUrl;

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

      // 4. Land back on the story.
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