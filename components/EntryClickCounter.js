"use client";

import { useEffect } from "react";
import { createClient } from "../lib/supabase/browser.js";

// Records one click on a story by calling the increment_entry_click database
// function once, when the story page first loads. It renders nothing.
//
// The call is deliberately fire-and-forget: counting is background bookkeeping,
// so a failure (for example before the clicks column has been added to the
// entries table in Supabase) never disturbs reading the story.
export default function EntryClickCounter({ entryId }) {
  useEffect(() => {
    const supabase = createClient();
    supabase
      .rpc("increment_entry_click", { entry_id: entryId })
      .then(() => {})
      .catch(() => {});
  }, [entryId]);

  return null;
}
