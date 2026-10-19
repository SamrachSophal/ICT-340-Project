"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/browser.js";
import EntryForm from "./EntryForm.js";
import { uploadEntryPhoto } from "../lib/uploadEntryPhoto.js";

export default function ContributeForm({ user }) {
  const router = useRouter();
  const supabase = createClient();

  // The contributor box starts pre-filled with the signed-in account's
  // username, but the contributor may change it to credit the actual person
  // who shared the story (for example, an elder telling the memory).
  // Accounts without a username fall back to "Anonymous"; the account's
  // email address is never used as the public contributor name.
  const contributor = user.user_metadata?.username || "Anonymous";

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
    //    session owner. User input is never spread into the row.
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

      // 3. Land on the new entry.
      router.push(`/entries/${data.id}`);
      return null;
    } catch (insertError) {
      console.error("Entry insert failed:", insertError);
      return "Something went wrong saving your story. Please try again.";
    }
  };

  return (
    <EntryForm
      initialValues={{ contributor }}
      onSubmit={handleSubmit}
      submitLabel="Contribute story"
      savingLabel="Saving…"
    />
  );
}