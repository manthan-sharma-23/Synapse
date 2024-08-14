import { defineConfig } from "drizzle-kit";

const dbCredentials = {
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
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
