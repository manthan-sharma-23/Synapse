import { Client } from "pg";
import { env } from "../core/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { readFileSync } from "fs";

let client: Client =
  env.node_env === "prod"
    ? new Client({
        connectionString: env.db_url,
        ssl: {
          rejectUnauthorized: false,
          ca: readFileSync("src/ca.pem").toString(),
        },
      })
    : new Client({
        connectionString: env.db_url,
      });

client.connect().then(() => {
  console.log("Database connected");
});
const db = drizzle(client, { schema, logger: env.node_env === "dev" });

export default db;

export * from "./schema";
