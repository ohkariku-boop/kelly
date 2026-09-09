# Kelly database (Supabase)

## One-shot setup

1. Open **SQL Editor** in your Kelly Supabase project (`lustugqkrtrmyyoekyui`).
2. Copy the entire contents of **[ALL.sql](./ALL.sql)**.
3. Paste and **Run**.

That single file:

- Creates all tables
- Enables RLS
- Fixes `workspace_members` policy recursion
- Adds profiles, invitations, `create_workspace_for_me`, `accept_invitation`
- Optionally enables RLS on `land_inland` if that table exists

Safe to re-run.

## Other files (reference / partial)

| File | Purpose |
|------|---------|
| `ALL.sql` | **Use this** — full setup |
| `schema.sql` | Core tables only (older) |
| `multi-user.sql` | Profiles + invites (older) |
| `fix-rls-recursion.sql` | Recursion fix only |

## After SQL

- **Authentication → URL configuration**
  - Site URL: `https://kellypm.vercel.app`
  - Redirect: `https://kellypm.vercel.app/**`
- Enable **Email** provider
- Open the app signed in and refresh the dashboard
