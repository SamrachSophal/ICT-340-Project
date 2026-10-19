import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server.js";

// Handles the email confirmation link from Supabase Auth, which looks like:
//   /auth/confirm?token_hash=...&type=email&next=/account-created
// The route exchanges the token for a session (so the new account is
// confirmed and signed in), then sends the user to the success page.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  // Only accept same-site `next` destinations; default to the success page.
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") ? nextParam : "/account-created";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Invalid, expired, or already-used confirmation link.
  return NextResponse.redirect(new URL("/login", request.url));
}
