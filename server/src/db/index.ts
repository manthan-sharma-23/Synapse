import { Client } from "pg";
import { env } from "../core/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const client = new Client({ connectionString: env.db_url });
client.connect().then(() => {
  console.log("Database connected");
});
const db = drizzle(client, { schema, logger: env.node_env === "dev" });

export default db;
export * from "./schema";
