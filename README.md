## Service Catalog SaaS

Next.js 14 + Supabase + Tailwind app for browsing AI services, submitting tasks, and triggering n8n webhooks.

### Setup
1) Create a Supabase project and add env vars in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

2) Run the SQL in `supabase_schema.sql` inside the Supabase SQL editor to create tables, RLS policies, bucket, and seed service.

3) Install deps and start:
```
npm install
npm run dev
```

### Auth & Routing
- Email/password login & signup on `/login`.
- Optional phone SMS OTP (enable in Supabase Auth settings + SMS provider).
- `/dashboard` is server-protected; unauthenticated users are redirected to `/login`.
- Session persistence handled via Supabase SSR helpers.

### Dashboard & Tasks
- Services pulled from the `services` table and shown as cards with cover, title, description, and `Use Agent` CTA.
- Modal adapts inputs based on `input_type` (`text`, `file`, `both`).
- Flow: upload file to `task-files` bucket (if provided) → insert into `tasks` → POST to the service `webhook_url`.
