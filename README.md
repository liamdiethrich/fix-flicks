# FixFlicks

FixFlicks is a Next.js + Prisma MVP for curated fix kits that convert Pinterest traffic into Amazon affiliate purchases.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Run onboarding setup (env + Prisma):
   ```bash
   npm run setup
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Database

- Update `DATABASE_URL` to point to SQLite for local development or Postgres for production.
- Run migrations with `npm run db:migrate` or the full setup with `npm run setup`.
- Optional: launch Prisma Studio with `npm run db:studio`.

## Content updates

Add new fixes or plans in JSON:
- `content/fixes/*.json`
- `content/plans/*.json`

Each file must satisfy the schemas in `src/lib/schemas.ts` and is validated at build time.

## Placeholder ASINs

Example content uses placeholder ASINs marked with `isPlaceholder: true`. Replace them with real ASINs before launch.

## Deployment notes

- Ensure `NEXT_PUBLIC_SITE_URL` points to `https://fix-flicks.com`.
- Set `AMAZON_ASSOCIATE_TAG_DEFAULT` (required) and `AMAZON_ASSOCIATE_TAG_PINTEREST` (optional).
- Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- Optional: set `NEXT_PUBLIC_AMAZON_ONELINK_SCRIPT_SRC` to Amazon's official OneLink script snippet. Do not use
  link shorteners or cloaking because it can break attribution.
- The domain is managed in Namecheap: Domain List → Manage → Advanced DNS → Host Records.

## Scripts

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
