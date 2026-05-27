# Deploy Subflix to Vercel (Phase A)

This guide takes you from the local repo to a public live URL in ~10 minutes.

**What you'll have at the end:**
- A GitHub repo at `https://github.com/<your-user>/subflix`
- A live deploy at `https://subflix-<hash>.vercel.app` (and a free custom alias if you want)
- Auto-redeploy on every `git push` to `main`

---

## Prerequisites

- A GitHub account (your local git is already configured as `JuanMedinaRdz` / `ghostt71@hotmail.com`).
- A free [Vercel account](https://vercel.com/signup) — sign up with **GitHub** so authorization is one click later.
- The local repo is already initialized and committed.

---

## Step 1 — Create the GitHub repo (1 min)

Go to **https://github.com/new** and fill in:

| Field           | Value                                  |
| --------------- | -------------------------------------- |
| Repository name | `subflix`                              |
| Description     | `Premium subscription analytics dashboard — Next.js portfolio project` |
| Visibility      | **Public** (so recruiters can browse)  |
| Init options    | **Leave all unchecked** (no README, no .gitignore, no license) |

Click **Create repository**. Don't run any of the commands GitHub suggests — use the ones below.

---

## Step 2 — Push your local repo (1 min)

In the project folder, run:

```bash
git remote add origin https://github.com/<your-user>/subflix.git
git push -u origin main
```

Replace `<your-user>` with your actual GitHub handle.

> If git asks for credentials, paste a [Personal Access Token](https://github.com/settings/tokens?type=beta) (Settings → Developer Settings → Fine-grained tokens, with `Contents: write` permission on the repo).

When done, refresh the GitHub page — you should see all the files.

---

## Step 3 — Import into Vercel (3 min)

1. Go to **https://vercel.com/new**.
2. Click **Import** next to `subflix` in the repo list. (If you don't see it, click **Adjust GitHub App Permissions** and grant access to the repo.)
3. Vercel auto-detects **Next.js**. Leave everything as default.
4. No environment variables needed for Phase A.
5. Click **Deploy**.

Wait ~90 seconds. You'll get a URL like:

```
https://subflix-abc123.vercel.app
```

That's your live demo.

---

## Step 4 — Tidy the URL (optional, 1 min)

In Vercel → your project → **Settings** → **Domains**, you can add a free alias such as:

```
subflix-juanmedina.vercel.app
```

Or, if you own a domain, point it here. Both are free.

---

## Step 5 — Add to your portfolio

In your portfolio project, add a card with:

```markdown
## Subflix — Subscription Analytics

Premium SaaS-style dashboard to track digital subscriptions, monthly spend,
renewals and analytics. Built with Next.js 15, TypeScript, TailwindCSS,
Framer Motion and Recharts.

[ Live demo ](https://subflix-juanmedina.vercel.app)  ·  [ Code ](https://github.com/<your-user>/subflix)
```

Recommended screenshot for the portfolio card:

- The dashboard with the **Featured renewal** hero + first row of tiles.
- 1280×720 is a good aspect for portfolio cards.

---

## What ships in Phase A

- Full UI: dashboard, subscriptions, analytics, calendar, settings.
- 14 seed subscriptions with realistic data.
- **localStorage persistence** — anything a visitor changes stays in *their* browser only.
- No login, no backend, no env vars.

This is enough for the portfolio demo. Recruiters can play with the seed data, add their own subscriptions, and explore the UI without affecting anyone else.

---

## What comes next (Phase B)

When you're ready for real multi-device usage:

1. Create a free [Supabase](https://supabase.com) project.
2. We'll swap `useSubscriptions` for a Supabase-backed version with Row Level Security so each user only sees their own data.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars in Vercel.
4. Add Supabase Auth (email magic link or Google).
5. Push → auto-redeploy.

Until then, the localStorage version is the demo URL.

---

## Auto-redeploys

Every `git push origin main` triggers a new Vercel build. Branches and pull requests get their own preview URLs automatically — useful for sharing work-in-progress.

```bash
git checkout -b feature/new-thing
# ...changes...
git commit -am "feat: new thing"
git push -u origin feature/new-thing
# Vercel comments on your PR with a preview link
```

---

## Troubleshooting

**Build fails on Vercel but works locally.**
Vercel uses Node 20+ by default. The `.nvmrc` file pins Node 20, which matches. Check the Vercel build logs for the actual error.

**The deploy URL shows a Vercel 404.**
The build probably failed. Open Vercel → your project → **Deployments** → click the latest → read the logs.

**Images don't load.**
The seed uses `https://cdn.simpleicons.org` — this is already whitelisted in `next.config.mjs`. If you change the source, add the hostname there.
