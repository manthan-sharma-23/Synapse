import { Client } from "pg";
import { env } from "../core/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function migrate_database() {
  const migrationClient = new Client({ connectionString: env.db_url });
  await migrationClient.connect();
  const db = drizzle(migrationClient);
  await migrate(db, { migrationsFolder: "src/db/drizzle" });
  await migrationClient.end();
}

migrate_database()
  .then(() => {
    console.log("✔️ Database migrated successfully");
  })
  .catch((err) => {
    console.log("❌ Error in migration", err);
  });
