import { Client } from "pg";
import { env } from "../core/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { readFileSync } from "fs";

async function migrate_database() {
  let migrationClient: Client;
  if (env.node_env === "prod") {
    migrationClient = new Client({
      connectionString: env.db_url,
      ssl: {
        rejectUnauthorized: false,
        ca: readFileSync("src/ca.pem").toString(),
      },
    });
  } else {
    migrationClient = new Client({
      connectionString: env.db_url,
    });
  }
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
