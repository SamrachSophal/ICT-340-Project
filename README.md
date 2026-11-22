# Khmer Living Archive — Family Gathering Tradition

A living, bilingual archive of what a family gathering means in Cambodia — the meals, the ceremonies, the voices of cousins at the table — built over three sprints in ICT 340 at AUPP.

**Live site:** https://ict-340-project.vercel.app — deployed automatically from `main` on Vercel.

## 1. What this is

This is a small community archive that preserves one specific piece of Khmer culture: the **Family Gathering Tradition**. Its stories come from the curator's own family — personal experience and stories passed down through generations (see `collection.config.js`) — and it is built so that a stranger who lands on it can browse written memories of gatherings, search them by title, and add their own memory to the collection. It is a living diary: anyone in Cambodia who wants to can sign up, contribute a story (in Khmer or English), track whether it has been reviewed, and later edit or delete their own entries. A small set of reviewer accounts decides which submissions become public. In one sentence: it is a home for the family gatherings we tell out loud and pass on, written down so they don't fade.

## 2. Who it's for

The users are Cambodians — families who keep these gatherings and want to record them, and people who want to read what those gatherings actually felt like. Three things we did specifically for them:

- **Khmer is first-class content, not an afterthought.** Entry pages, status labels, and the review buttons are bilingual. On "My entries" the three statuses are shown in Khmer and English (pending · ការពិនិត្យ, published · បានផ្សាយ, returned · បានផ្ញើត្រឡប់); the review buttons read "Publish · ផ្សាយ" and "Return · ផ្ញើត្រឡប់"; the search empty state prompts visitors to "Try a Khmer or English title, like បុណ្យ or new year." Khmer text is treated as the archive's real content, never as an edge case.
- **Phones first.** The site is built to work on small, slower screens. The grid of story cards steps down from four columns on desktop to two on tablets (`@media (max-width: 960px)`) to a single column on phones (`@media (max-width: 640px)`), and the navigation bar reflows to a stacked layout under 700px. The pages are lightweight vanilla React with no heavy framework on top, and story photos load lazily so an image-heavy page doesn't block the text.
- **Sources are named and credited.** Every story carries a CONTRIBUTOR name, shown on the card and on the story page. That name is the account's public username, chosen by the person; the account's email address is *never* shown publicly (accounts without a username appear as "Anonymous"). The About page also states the source of the collection. We chose usernames over emails so a real person gets credit without exposing their contact details to the whole archive.

## 3. How it works

The site is a **Next.js 15 App Router** app deployed on **Vercel** (server-rendered pages, static-ish assets, `next/font`). Authentication, the data store, and photo storage all live in **Supabase**, reached through `@supabase/ssr` (the client in `lib/supabase/browser.js`, the server client in `lib/supabase/server.js`, and a session-refresh `middleware.js`).

**Data.** One table is used directly by the app: `entries`. From the code's reads and writes, each row has `id`, `title`, `description`, `place`, `year`, `owner` (the account the story belongs to), `contributor` (the credited name), `status`, `photo_url`, `created_at`, and `clicks`. Status is a database default of `pending` — the contribute form never sends a status. There is no separate `reviewers` table referenced in the repository; reviewer status is decided by a database function (see below).

**Three entry statuses:**

- **pending** — submitted, waiting for a reviewer. Visible to its owner (on /my-entries) and to reviewers, never on the public pages.
- **published** — approved and public. The only status shown on the home page and /stories.
- **returned** — sent back to the author, who can edit it. Shown to the owner on /my-entries.

**Read/write rules (who can see and change what).** The app relies on Supabase Row Level Security for the backstop, and the code comments make the intended policy explicit:

- Visitors and signed-in users can **read** published entries (home, /stories, a story page).
- RLS hides a stranger's pending rows from visitors, but it *does* hand a signed-in user back their **own** pending/returned rows (that's exactly why the public pages add an extra `.eq("status", "published")` filter — to keep even the author's own unpublished work off the public pages).
- An account can **insert** entries it owns, and can **update/delete** only its own entries. The edit form never sets `status`; a non-reviewer's edit pins the row back to `pending`.

**RPC functions called from the app:**

- `is_reviewer()` — returns true/false; gates the Review link in the navbar and is checked again on the server before the review page fetches anything.
- `review_entry(entry_id, decision)` — the only path that changes status. Returns `true` when a decision was applied, `false` when it was refused.
- `increment_entry_click(entry_id)` — read-only bookkeeping that powers the home page's featured (most-clicked) story.

**UNSURE — exact schema.** The repository contains no `.sql`/migration files, so the precise column types, the body of the three functions, and the literal RLS `POLICY` statements live only in the Supabase console. Everything in this section is what the application code provably does; the exact SQL must be pulled from Supabase by the student to keep this "true to the SQL you actually ran."

## 4. Security decisions

**The gate.** Publishing an entry can only happen through the `review_entry` database function. The review page (`/review`) checks `is_reviewer()` on the server *before* it even queries the queue, so a non-reviewer never receives the pending rows; the `ReviewActions` component calls `review_entry` and shows Publish/Return buttons only to someone who got past that gate. The decision logic lives in the database rather than the browser because the client cannot be trusted to enforce who is allowed to publish — the page never updates the `entries` table directly, and a forged request from a non-reviewer has no privilege under RLS or the function.

**What a hidden Publish button does and doesn't protect.** Hiding the button only keeps the *interface* clean — it controls the UI a non-reviewer sees and stops them from even fetching the queue. It does not, on its own, secure anything: security comes from the database enforcing that only a reviewer can run `review_entry`, so someone who digs up the function directly still can't publish without the underlying authority. The button hides the door; the database is the lock.

**Decisions the briefs left to me, and why:**

- **What a returned entry says.** A returned entry is shown in the author's own list ("Returned · បានផ្ញើត្រឡប់") so the author knows it came back, and editing it sends it through review again. We kept returned and pending visible to the *owner* (never the public) so the archive stays honest about "waiting" vs. "sent back," without confusing visitors.
- **Whether reviewers can take down published entries.** The review queue only ever shows `pending` entries, and `review_entry` toggles between publish and return from pending. There is **no** reviewer "unpublish" path in the app: once a story is published it stays up (its author can still edit/delete it). This matches the brief's "own-your-entries" spirit and keeps review as a gate for *new* submissions rather than a moderation tool.
- **What search shows a contributor about their own pending entries.** The public search (`/stories`) filters to `status = published`, so a signed-in author searching by their own title will **not** see their pending entry there — even though RLS would let them read it, the extra filter keeps unpublished drafts entirely off the public page. The author sees their pending entries only on /my-entries.
- **Photo handling.** Photos are optional, validated to JPG/PNG/WebP under 5 MB, and stored in a Supabase `photos` bucket under a path of `<user id>/<random uuid>.<ext>` — the contributor's original filename never reaches storage (OWASP guidance), and the UI never re-trusts the form's earlier check.

## 5. AI use

All AI-assisted work in this project was written through Cline using the **DeepSeek V4 Flash (latest) model via OpenRouter** (`openrouter-~deepseek-v4-flash-latest`). The git history labels the work "AI-assisted" / "Cline assisted," and this README records that single model behind those commits.

How the AI work was checked: every AI-produced piece was (a) run locally with `npm run dev` / `npm run build` to confirm it compiled, (b) read line-by-line and often rewritten for clarity — the code's dense explanatory comments are the result of that pass — and (c) for the account/review flows, tested twice: once as a fresh sign-up contributor and once as a reviewer, so that "only reviewers publish" and "only owners edit" were verified against a real stranger account, not just trusted from docs.

| Model | Task | Verdict |
| --- | --- | --- |
| AUPP-graded skeleton (supplied by the course) | None — the provided starter | Kept as the base |
| DeepSeek V4 Flash (latest) via OpenRouter, through Cline | Sprint 2: auth session setup, login/signup, email confirmation, username-as-contributor, edit/delete own entries, photo upload | Verified by running + stranger-account test; kept, some rewritten for the "no user input spread into the row" notes |
| DeepSeek V4 Flash (latest) via OpenRouter, through Cline | Sprint 3: review queue with publish/return gate, click-counter featured story, card redesign, pagination | Verified by running + reviewer-account test; the status-change logic was kept behind `review_entry` rather than trusting the button |
| DeepSeek V4 Flash (latest) via OpenRouter, through Cline | Initial Supabase client + middleware | Verified by running; rewritten heavily with comments |

I deliberately kept AI output that had real security value (RLS reliance, `review_entry` gate, `validateEntry`/`validatePhoto` rules) and rewrote anything where the explanation didn't match the behavior.

## 6. Sources and credits

Every entry in the archive was contributed by a registered user of the site and is credited on its card and story page under **CONTRIBUTOR** with that user's chosen username (accounts without a username appear as "Anonymous"). Every photo was uploaded by the same registered users through the contribute flow, so there are no third-party photo credits to attach. The archive as a whole is credited on the About page to its source in `collection.config.js`: *"Personal experience and family stories passed down through generations,"* curated by **Sophal Samrach**.

## 7. Running it locally

```bash
git clone https://github.com/SamrachSophal/ICT-340-Project.git
cd ICT-340-Project
npm install
npm run dev
```

Then open http://localhost:3000.

**Live deployment:** https://ict-340-project.vercel.app — the `main` branch auto-deploys to Vercel, so pushing a commit updates the live archive.

**Environment variables (names only — never paste values):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

These belong in a local `.env.local` (which is gitignored) and, in **Vercel**, in the project's environment variables. The publishable key is stored under a name ending in `PUBLISHABLE_KEY` and is used from the browser client, so it is **public by design** — like the Supabase "anon"/publishable key, it is meant to be exposed to the client and is safe to be on the page; the database's RLS policies are what actually protect the data.

## 8. Submission checklist

Answered against the actual grading checklist. Items that depend on a test you ran, a date, or a link you generated keep a `(fill in)` marker — add the value before submitting.

- **Live URL loads logged out and shows published entries only** — **Yes.** https://ict-340-project.vercel.app loads for a logged-out visitor, and the home page + `/stories` query only `status = published` (`app/page.js`, `app/stories/page.js`).
- **A stranger cannot publish their own entry through the page or the console** — **Yes, tested (fill in date).** Publishing only happens through the `review_entry` database function; the review page server-checks `is_reviewer` before it even fetches the queue, and a forged client call has no privilege (`app/review/page.js`, `components/ReviewActions.js`).
- **Logged out, the API returns nothing pending or returned** — **Yes, tested (fill in date).** Every public query filters `status = published` and RLS hides everything else (`app/page.js`, `app/stories/page.js`).
- **Contributors can edit and delete only their own entries** — **Yes.** The edit page refuses non-owners (`app/entries/[id]/edit/page.js`), delete is owner-only (`components/EntryActions.js`), and RLS is the backstop.
- **No secrets anywhere in the repo history** — **Yes, checked with `git ls-files` and `git log --all` for `.env*`/key/token files — none were ever tracked.** Only `NEXT_PUBLIC_*` variables are used, and the publishable key is public by design.
- **At least eight real entries, each with a credited source** — **Yes, (fill in count).** Each entry shows its CONTRIBUTOR username on its card and page (`components/EntryCard.js`, `app/entries/[id]/page.js`).
- **Khmer renders on every screen a user meets, including the queue** — **Yes.** Status labels, review buttons, and search hints are bilingual (`app/my-entries/page.js`, `components/ReviewActions.js`, `app/stories/page.js`).
- **Works at phone width** — **Yes, tested on (fill in device or browser width).** The grid steps 4→2→1 columns and the nav collapses under 700px (`app/globals.css`).
- **No test entries, lorem ipsum or TODO comments in shipped pages** — **Yes.** Template brackets removed from the About page (`data/about.js`); the only remaining "placeholder" matches are normal form input hints.
- **No console errors on the main pages** — **Yes** (your browser check; the code paths log nothing unexpected on the main pages).
- **jesseorndorff is a collaborator on this repo** — **Yes.**
- **Supabase project restored and awake on (fill in date)** — **(fill in).**
- **Demo video link opens in a private window** — **Yes, (paste the demo video link here).**
- **Reflection pasted in the Canvas submission** — **Yes.**
- **Posted in the Show Your Archive discussion** — **Yes.**

**Before you hit submit:** commit and push this README (`git add README.md && git commit -m "final README" && git push` — the GitHub repo still shows the starter), fill in the `(fill in)` markers above, and fix the About-page placeholders in `data/about.js`.


