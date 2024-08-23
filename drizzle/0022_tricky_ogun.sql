CREATE TABLE IF NOT EXISTS "nodes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"botId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bots" DROP COLUMN IF EXISTS "isArchived";--> statement-breakpoint
ALTER TABLE "bots" DROP COLUMN IF EXISTS "parentBotId";