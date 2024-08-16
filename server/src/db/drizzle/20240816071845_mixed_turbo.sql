ALTER TABLE "users" ADD COLUMN "online_status" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_logged_in" timestamp DEFAULT now() NOT NULL;