ALTER TABLE "roles_to_permissions" ADD COLUMN "orgId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "roles_to_permissions" ADD COLUMN "recordStatus" text DEFAULT 'created';--> statement-breakpoint
ALTER TABLE "teams_to_users" ADD COLUMN "orgId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teams_to_users" ADD COLUMN "recordStatus" text DEFAULT 'created';--> statement-breakpoint
ALTER TABLE "users_to_channels" ADD COLUMN "orgId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_channels" ADD COLUMN "recordStatus" text DEFAULT 'created';