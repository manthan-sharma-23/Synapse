ALTER TABLE "user_room" DROP CONSTRAINT "user_room_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_room" DROP CONSTRAINT "user_room_room_id_rooms_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_room" ADD CONSTRAINT "user_room_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_room" ADD CONSTRAINT "user_room_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
