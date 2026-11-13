# FitLife

A personal training, nutrition and progress tracker, built around my coach's plan and improved for daily use.
It's an installable web app (PWA) that works offline. With Supabase it syncs between phone and computer.

## What it does

- **Nutrition:** the coach's meal plan with live calorie and macro totals, and rest days that drop the pre-workout meal.
  - **Swaps** offer foods from the same group with the amount recalculated. You choose what to match: protein, carbs, fat or calories (auto picks the food's main macro).
  - Every option shows its macro difference before you confirm.
  - A swap can be *today only* or *always* (updates your plan, and you can still go back to the coach's version).
  - Also: raw→cooked weights for meal prep, extra foods, your own foods, notes per meal, and a shopping list.
- **Training:** the 7-day split with videos that play inside the app (YouTube, TikTok, Instagram embeds).
  - The set logger shows last session's numbers next to each set.
  - Weight suggestions use double progression: hit the top of the rep range and it suggests the next weight.
  - Each set starts a rest timer using the coach's rest time.
  - Swap a busy machine for another exercise for the same muscle.
  - Notes per exercise and per session, strength charts and history.
- **Progress:** weight with a 7-day average, body measurements, and progress photos compared side by side.
- **Habits:** water, steps, sleep, custom habits with streaks, a daily journal, and a weekly check-in that summarises your week and copies it for your coach.
- English / Arabic (RTL), light and dark themes, and backups via export/import.

## Run it locally

```bash
npm install
npm run dev
```

Without a `.env` file the app runs in **this device only** mode, and data stays in the browser (IndexedDB).

## Set up cloud sync (Supabase)

1. Create a free project at <https://supabase.com>.
2. **SQL Editor → New query**: paste [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   This creates the `docs` table, its row-level security, and a private `photos` storage bucket.
3. **Project Settings → API**: copy the *Project URL* and the *anon public* key into `.env` (see `.env.example`):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
   The anon key is meant to be public. Row-level security is what protects the data.
4. **Authentication → URL Configuration**: set *Site URL* to where the app is hosted (for example `https://<you>.github.io/fitlife/`). Add `http://localhost:5173` under *Redirect URLs* for local development.
5. Open the app, choose **Create account**, confirm the email, and sign in. Data you logged before signing in is uploaded.
   To stop new sign-ups after creating your own account, turn off **Authentication → Sign In / Providers → Allow new users to sign up**.

## Deploy (GitHub Pages)

1. Create a GitHub repository and push this folder to `main`.
2. **Settings → Pages → Source: GitHub Actions**.
3. **Settings → Secrets and variables → Actions → Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Every push to `main` builds and deploys through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

The build uses relative paths, so Cloudflare Pages or Netlify work too: build command `npm run build`, output `dist`, and the same two environment variables.

**Install on your phone:** open the site, then *Add to Home Screen* (iOS Safari) or *Install app* (Android Chrome).

## How sync works

- Everything is a JSON document `(collection, id)`: `settings/main`, `plan/main`, `days/<date>`, `workouts/<id>`, `body/<date>`, `checkins/<id>`, `notes/<key>`, `foods/<id>`, `active/main`.
- Edits go to IndexedDB first (instant, works offline) and are marked dirty. About 1.5 s later they're upserted to Supabase.
- Pulls fetch rows changed since the last pull: on start, every 60 s, when the app regains focus, and when the network comes back.
- Conflicts are resolved per document by *last write wins* on the device timestamp, enforced in a Postgres trigger.
- The coach's default plan and settings are local seeds with timestamp 0, so a copy already in your account always wins over them.
- Photos are compressed on the device (max 1200 px JPEG), cached locally, and stored in the private `photos` bucket under `<user id>/`.

## Project layout

```
src/
  data/        coach plan, exercise library (with video links), food library
  domain/      nutrition math & swaps, training suggestions, cycle, weekly summary
  store/       local document store (IndexedDB) + Supabase sync
  views/       Home, Nutrition, Training, Progress, Habits, Settings, Auth
  components/  shared UI (sheet, charts, rings, video player)
supabase/      database schema
legacy/        the two earlier single-file prototypes, kept for reference
```
