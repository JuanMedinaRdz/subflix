# Supabase setup (Phase B)

You'll do **3 things in the Supabase UI** and **1 thing in Vercel**. Total ~10 minutes.

---

## 1. Create the project

1. Go to https://supabase.com/dashboard → **New project**.
2. Name: `subflix`. Region: pick the closest to you. Set a strong DB password.
3. Wait ~2 minutes for it to provision.

---

## 2. Run the schema migration

In your Supabase project → **SQL Editor** → **New query** → paste the entire block below → **Run**.

```sql
-- ============================================================
-- Subflix schema + RLS + auto-seed on signup
-- ============================================================

create table if not exists public.subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  description   text,
  category      text not null,
  price         numeric(10,2) not null check (price >= 0),
  currency      text not null default 'USD',
  billing_cycle text not null check (billing_cycle in ('weekly','monthly','quarterly','yearly')),
  next_renewal  timestamptz not null,
  started_at    timestamptz not null default now(),
  status        text not null default 'active' check (status in ('active','paused','cancelled','trial')),
  color         text not null default '#3366ff',
  logo          text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_next_renewal_idx on public.subscriptions(next_renewal);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- RLS
alter table public.subscriptions enable row level security;

drop policy if exists "own subs select" on public.subscriptions;
drop policy if exists "own subs insert" on public.subscriptions;
drop policy if exists "own subs update" on public.subscriptions;
drop policy if exists "own subs delete" on public.subscriptions;

create policy "own subs select" on public.subscriptions
  for select using (auth.uid() = user_id);
create policy "own subs insert" on public.subscriptions
  for insert with check (auth.uid() = user_id);
create policy "own subs update" on public.subscriptions
  for update using (auth.uid() = user_id);
create policy "own subs delete" on public.subscriptions
  for delete using (auth.uid() = user_id);

-- Seed each new user with the demo portfolio
create or replace function public.seed_subscriptions_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.subscriptions
    (user_id, name, description, category, price, currency, billing_cycle, next_renewal, started_at, status, color, logo)
  values
    (new.id, 'Netflix',      'Premium 4K plan',     'Entertainment', 22.99, 'USD', 'monthly', now() + interval '2 days',  now() - interval '420 days', 'active', '#E50914', 'netflix'),
    (new.id, 'Spotify',      'Family plan',          'Music',         16.99, 'USD', 'monthly', now() + interval '5 days',  now() - interval '800 days', 'active', '#1DB954', 'spotify'),
    (new.id, 'ChatGPT Plus', 'OpenAI Plus',          'AI',            20.00, 'USD', 'monthly', now() + interval '11 days', now() - interval '200 days', 'active', '#10A37F', 'openai'),
    (new.id, 'Claude Pro',   'Anthropic Pro',        'AI',            20.00, 'USD', 'monthly', now() + interval '18 days', now() - interval '120 days', 'active', '#D97757', 'anthropic'),
    (new.id, 'GitHub Pro',   'Developer tools',      'Developer',      4.00, 'USD', 'monthly', now() + interval '8 days',  now() - interval '900 days', 'active', '#ffffff', 'github'),
    (new.id, 'Vercel Pro',   'Hosting and deploys',  'Developer',     20.00, 'USD', 'monthly', now() + interval '15 days', now() - interval '380 days', 'active', '#ffffff', 'vercel'),
    (new.id, 'Notion',       'Plus plan',            'Productivity',  10.00, 'USD', 'monthly', now() + interval '22 days', now() - interval '640 days', 'active', '#ffffff', 'notion'),
    (new.id, 'Linear',       'Standard plan',        'Productivity',   8.00, 'USD', 'monthly', now() + interval '27 days', now() - interval '310 days', 'active', '#5E6AD2', 'linear'),
    (new.id, 'iCloud+',      '2 TB storage',         'Cloud',          9.99, 'USD', 'monthly', now() - interval '3 days',  now() - interval '700 days', 'active', '#A5C2DE', 'icloud'),
    (new.id, 'Disney+',      'Standard with ads',    'Entertainment',  7.99, 'USD', 'monthly', now() + interval '1 days',  now() - interval '180 days', 'active', '#0E47A1', 'disneyplus'),
    (new.id, 'NYTimes',      'All Access',           'News',          17.00, 'USD', 'monthly', now() + interval '14 days', now() - interval '540 days', 'active', '#ffffff', 'thenewyorktimes'),
    (new.id, 'Figma',        'Professional',         'Productivity',  15.00, 'USD', 'monthly', now() + interval '20 days', now() - interval '450 days', 'active', '#F24E1E', 'figma'),
    (new.id, 'Amazon Prime', 'Annual plan',          'Entertainment',139.00, 'USD', 'yearly',  now() + interval '60 days', now() - interval '330 days', 'active', '#FF9900', 'amazon'),
    (new.id, 'Dropbox',      'Plus 2TB',             'Cloud',         11.99, 'USD', 'monthly', now() + interval '9 days',  now() - interval '220 days', 'paused', '#0061FF', 'dropbox');
  return new;
end; $$;

drop trigger if exists on_auth_user_seed on auth.users;
create trigger on_auth_user_seed
  after insert on auth.users
  for each row execute function public.seed_subscriptions_for_new_user();
```

You should see `Success. No rows returned.`

---

## 3. Configure Auth redirect URLs

In your Supabase project → **Authentication** → **URL Configuration**:

- **Site URL**:
  ```
  https://subflix-5mztv76oq-juan-carlos-medina-s-projects.vercel.app
  ```
  (or whichever Vercel alias you keep)

- **Redirect URLs** (add all of these, one per line):
  ```
  http://localhost:3000/auth/callback
  https://subflix-5mztv76oq-juan-carlos-medina-s-projects.vercel.app/auth/callback
  https://*.vercel.app/auth/callback
  ```

> The `*.vercel.app` line covers preview deploys for branches.

In **Authentication → Providers**, **Email** is enabled by default with magic link working out of the box. No SMTP setup required — Supabase sends 4 emails per hour per project for free.

---

## 4. Get your env vars

In Supabase → **Project Settings** → **API**, copy:

| Variable                          | Where to find it                          |
| --------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | "Project URL"                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | "Project API keys" → `anon` `public` key  |

> The `anon` key is safe to expose in the browser — RLS protects the data.

---

## 5. Add them to Vercel

In Vercel → your `subflix` project → **Settings** → **Environment Variables**:

- Add `NEXT_PUBLIC_SUPABASE_URL` (Production + Preview + Development).
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same).

Then redeploy: **Deployments** tab → latest → **Redeploy** (uncheck "Use existing build cache").

---

## 6. Local development

Create `.env.local` in the project root (gitignored already):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then:

```bash
npm run dev
# → http://localhost:3000
```

---

## How the app behaves

- **Not logged in**: app works exactly as before — seed data in `localStorage`. Perfect for portfolio recruiters who land on the URL.
- **Logged in**: data lives in Supabase under your user. Sync across laptop + phone. New accounts get the seed portfolio automatically so they have something to play with immediately.

---

## First login flow

1. Click **Sign in** in the top bar.
2. Enter your email.
3. Open the email from Supabase, click the magic link.
4. You land back on the app, authenticated. Your subscriptions are now persisted in Supabase.

Subsequent logins from a new device: same flow — just enter your email and click the link.
