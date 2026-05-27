# Subflix — Subscription Analytics Platform

> A premium-looking SaaS dashboard to track, analyze and control your digital subscriptions.
> Built as a portfolio piece to showcase modern frontend engineering, clean architecture and QA automation skills.

![Subflix screenshot placeholder](./docs/screenshot-dashboard.png)

---

## Overview

Subflix lets you:

- Track every digital subscription you pay for (Netflix, Spotify, ChatGPT, GitHub, …).
- See your **monthly** and **yearly** spend at a glance.
- Visualize spend trends, category breakdowns and the most expensive services.
- View upcoming renewals on a calendar and never get charged by surprise again.
- Pause, edit or delete subscriptions with smooth, premium UX.

The whole interface is dark-mode-first, glassmorphic, and inspired by **Linear**, **Vercel**, **Stripe** and **Netflix**.

This first release is a **visual MVP** powered by mock data persisted in `localStorage` — no backend required.
A roadmap toward Supabase + Playwright + CI/CD is below.

---

## Tech stack

| Layer            | Tools                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | Next.js 15 (App Router), React 19, TypeScript (strict)                |
| Styling          | TailwindCSS, custom design tokens, shadcn-style primitives            |
| UI primitives    | Radix UI (Dialog, Dropdown, Select, Label)                            |
| Animation        | Framer Motion                                                         |
| Charts           | Recharts                                                              |
| Icons            | lucide-react + Simple Icons (brand logos)                             |
| State / data     | React hooks + `localStorage` (mock data layer)                        |
| Planned          | Supabase Auth + Postgres, Playwright e2e, GitHub Actions, Vercel      |

---

## Project structure

```
src/
├─ app/                  # Next.js App Router pages
│  ├─ page.tsx           # Dashboard
│  ├─ subscriptions/     # CRUD page
│  ├─ analytics/         # Recharts views
│  ├─ calendar/          # Renewals calendar
│  ├─ settings/
│  ├─ layout.tsx
│  └─ globals.css        # Design tokens, glass, grid bg
├─ components/
│  ├─ ui/                # Base primitives (Button, Card, Dialog, Input, …)
│  ├─ layout/            # AppShell, Sidebar, Topbar
│  ├─ dashboard/         # MetricCard, SpendingTrend, CategoryBreakdown, …
│  └─ subscriptions/     # SubscriptionCard, SubscriptionFormDialog, SubLogo
├─ hooks/
│  └─ use-subscriptions.ts   # CRUD + localStorage persistence
├─ lib/
│  ├─ utils.ts           # cn(), formatCurrency, daysUntil, formatDate
│  ├─ subscriptions.ts   # Domain logic: totals, trends, by category, …
│  └─ mock-data.ts       # Seed portfolio of realistic subscriptions
└─ types/
   └─ index.ts           # Subscription, Category, BillingCycle, …
```

Separation of concerns:

- **UI primitives** know nothing about subscriptions.
- **Feature components** (`dashboard/`, `subscriptions/`) compose primitives with domain data.
- **Hooks** are the only place that touches storage.
- **`lib/subscriptions.ts`** holds pure domain functions, easy to unit-test.

---

## Getting started

```bash
# 1. Install
npm install

# 2. Run the dev server
npm run dev

# 3. Open
# http://localhost:3000
```

> The app boots with a seed of 14 realistic subscriptions. Use **Reset demo** in Settings or on the Subscriptions page to restore them at any time.

Scripts:

```bash
npm run dev        # Next.js dev server
npm run build      # Production build
npm run start      # Run production build
npm run lint       # ESLint
npm run typecheck  # TypeScript strict check
```

---

## Features

### Dashboard

- 4 metric cards (monthly, yearly, active, upcoming) with gradient accents and motion entry.
- **Spending trend** — 12-month area chart (Recharts).
- **By category** — donut chart with center total and legend.
- **Upcoming renewals** — next 14 days with “Today / Tomorrow / in Nd / Nd overdue” badges.
- **Top spend** — horizontal bars colored by each service’s brand color.
- Overdue alert banner when applicable.

### Subscriptions

- Responsive grid of premium cards (logo, gradient top border, status badges).
- Search by name + filter by category.
- New / Edit dialog with all fields: name, description, price, cycle, category, next renewal, color, logo slug.
- Pause / resume and delete from the card dropdown.
- Empty state and reset-to-demo.

### Analytics

- Line chart of monthly spend trend with YoY delta.
- Horizontal bar chart of spend by category.
- Vertical bar chart of top expensive services using brand colors.
- KPIs: monthly, yearly, average per sub, most expensive.

### Calendar

- Month view of renewals, with logos per day.
- Today is highlighted with a glow ring; past days dim.
- Pulse indicator for overdue renewals.
- Month total badge.

---

## Design system

Implemented in [`globals.css`](src/app/globals.css) and [`tailwind.config.ts`](tailwind.config.ts):

- CSS variables for light/dark, but dark is the canonical mode.
- `.glass` and `.glass-subtle` for backdrop-blurred surfaces with subtle inner highlights.
- `.gradient-brand` and `.gradient-text` utilities.
- `.grid-bg` for the masked grid background.
- Custom keyframes: `fade-in`, `shimmer` (skeletons), `gradient-shift`.
- Brand palette extends Tailwind under `brand.50 … brand.900`.
- Premium scrollbars.

Components in [`src/components/ui/`](src/components/ui/) follow the shadcn convention (Radix + `cva` + `cn`).

---

## Roadmap

The current release is **Phase 1** of a larger plan. Future phases:

| Phase | Scope                                                                  |
| ----- | ---------------------------------------------------------------------- |
| 2     | Supabase Auth (login / signup / password reset) + protected routes     |
| 3     | Supabase Postgres + Row Level Security replacing the localStorage layer|
| 4     | Notification system (toast + scheduled email/push reminders)           |
| 5     | Playwright e2e suite: Page Object Model, retries, parallel, reports    |
| 6     | In-app Testing dashboard surfacing the latest Playwright results       |
| 7     | GitHub Actions: lint → typecheck → build → playwright → deploy         |
| 8     | i18n (en/es), settings page, currency support, accessibility audit     |

---

## QA Automation (planned)

The repo is already structured to plug Playwright in cleanly:

- Stable selectors via `data-testid` already exist on key elements
  (`metric-monthly`, `subscription-card`, `add-subscription`, `form-name`, …).
- Domain logic isolated in `lib/subscriptions.ts` for fast unit tests.
- Mock data layer means tests don’t need a backend to run.

Planned structure:

```
tests/
├─ e2e/
│  ├─ auth.spec.ts
│  ├─ dashboard.spec.ts
│  ├─ subscriptions.spec.ts
│  └─ calendar.spec.ts
├─ pages/                # Page Object Model
│  ├─ DashboardPage.ts
│  └─ SubscriptionsPage.ts
└─ fixtures/
```

---

## Deploy

The project is Vercel-ready out of the box.

```bash
npx vercel
```

No environment variables are required for the MVP.

---

## Credits

- Brand logos from [Simple Icons](https://simpleicons.org) via `cdn.simpleicons.org`.
- Design inspiration: Linear, Vercel, Stripe, Netflix, Notion.
