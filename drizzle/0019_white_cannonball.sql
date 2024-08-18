CREATE TABLE IF NOT EXISTS "nodes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"isArchived" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "bots" ADD COLUMN "isArchived" boolean DEFAULT false;