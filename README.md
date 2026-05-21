This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Database (collecting user posts)

When visitors finish the journey and **Publish** in the gallery, the app saves a row to Postgres (`PublishedIsland`: group name, value/text/practice choices, reflection). The API is `/api/published-islands` (GET list, POST publish).

### One-time setup

1. **Create Postgres** — [Neon](https://neon.tech) (free tier) → New project → copy the **PostgreSQL** connection string.
2. **Local** — copy `.env.example` to `.env`, set `DATABASE_URL`, then:
   ```bash
   npm run db:setup
   ```
3. **Vercel** — project `global-beit-midrash` → **Settings → Environment Variables** → add `DATABASE_URL` (same string) for **Production** and **Preview**, or use **Storage → Neon** integration. Redeploy after saving.

After setup, publishing in the app persists posts for everyone; without `DATABASE_URL`, publish/load shows a temporary error.

## Deploy on Vercel

Deploy via GitHub (`main`). Ensure `DATABASE_URL` is set on Vercel (see above). Migrations are not run during build; after schema changes run `npm run db:migrate:deploy` against production.
