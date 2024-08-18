import { defineConfig } from "drizzle-kit";

const dbCredentials = {
  db_url: process.env.DB_URL!,
};

export default defineConfig({
  dialect: "postgresql",
  out: "./src/db/drizzle",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: dbCredentials.db_url,
  },
  migrations: {
    prefix: "timestamp",
    schema: "./src/db/schema.ts",
  },
  verbose: true,
  strict: true,
});
