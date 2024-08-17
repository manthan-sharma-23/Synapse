import "dotenv/config";

export const env = {
  host: process.env.DB_HOST!,
  db_port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  db_url: process.env.DB_URL!,
  node_env: process.env.NODE_ENV! as "dev" | "prod",
  port: Number(process.env.PORT!) || 2800,
  JWT_SECRET: process.env.JWT_SECRET!,
  REDIS_URL: process.env.REDIS_URL!,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY!,
  CLOUD_FRONT_DOMAIN: process.env.CLOUD_FRONT_DOMAIN!,
};
