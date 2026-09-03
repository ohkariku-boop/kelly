# Kelly

**Everything a PM needs. Nothing else.**

Kelly is a minimalist product management tool designed as a calm command center for Product Managers. It focuses on the real hierarchy PMs think in — Goals → Initiatives → Items — plus feedback and stakeholder updates, without the bloat of traditional PM / PMO tools.

## Philosophy

Inspired by the restraint of Kaneo and the polish of Linear, Kelly is built for the *product* side of the work rather than pure issue tracking.

- Minimal surface area
- Opinionated defaults
- Connected context (feedback ↔ items ↔ initiatives ↔ goals ↔ updates)
- Calm UI

## Current status

This is the **MVP scaffold**.

### What’s included

- Next.js 15 + TypeScript + Tailwind
- Supabase client helpers (browser + server)
- Database schema (`supabase/schema.sql`) covering:
  - Workspaces & members
  - Goals / Outcomes
  - Initiatives
  - Items (roadmap units) with lightweight RICE fields
  - Feedback
  - Stakeholder Updates
  - Labels & comments
- Landing page, login (magic link), and dashboard shell

### What’s next (post-scaffold)

1. Auth flow + workspace creation
2. Full CRUD for Goals / Initiatives / Items
3. Now–Next–Later + list + simple timeline views
4. Feedback capture & linking
5. Structured Updates generator
6. RLS hardening & invites

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. In **Settings → API Keys**, copy:
   - Project URL
   - Publishable key (the one starting with `sb_publishable_...`)

### 2. Local environment

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 3. Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Backend / Auth / DB**: Supabase (Postgres + Auth + RLS)
- **UI primitives**: lucide-react, clsx, tailwind-merge, cva

## License

MIT
