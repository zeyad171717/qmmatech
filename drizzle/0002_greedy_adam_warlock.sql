ALTER TABLE "abundantCarts" ADD COLUMN "sr" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "alerts" ADD COLUMN "sr" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "bankTransfer" ADD COLUMN "sr" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "bankTransfer" ADD COLUMN "time" text NOT NULL;--> statement-breakpoint
ALTER TABLE "newLogin" ADD COLUMN "sr" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "newLogin" ADD COLUMN "time" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payOnReceive" ADD COLUMN "sr" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "payOnReceive" ADD COLUMN "time" text NOT NULL;--> statement-breakpoint
ALTER TABLE "receiverGift" ADD COLUMN "sr" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "receiverGift" ADD COLUMN "time" text NOT NULL;