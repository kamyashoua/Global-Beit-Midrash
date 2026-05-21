/**
 * Creates tables for user-published islands (posts) on your Postgres database.
 * Requires DATABASE_URL in the environment (see .env.example).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(name) {
  const path = resolve(process.cwd(), name);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  console.error(`
DATABASE_URL is not set.

1. Create a free Postgres database at https://neon.tech
2. Copy the connection string (postgresql://...)
3. Add it to .env:
   DATABASE_URL="postgresql://..."
4. Run: npm run db:setup

For production on Vercel (project: global-beit-midrash):
  Storage → Create Database → Neon, or Settings → Environment Variables → DATABASE_URL
`);
  process.exit(1);
}

if (!/^postgres(ql)?:\/\//i.test(url)) {
  console.error(
    "DATABASE_URL must start with postgresql:// or postgres:// (not SQLite or placeholders).",
  );
  process.exit(1);
}

console.log("Applying Prisma migrations (PublishedIsland table for user posts)…\n");
execSync("npx prisma migrate deploy", {
  stdio: "inherit",
  env: process.env,
});
console.log("\nDatabase ready. User posts are stored when they click Publish in the gallery.");
