CREATE TABLE IF NOT EXISTS "abundantCarts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status_code" text NOT NULL,
	"name" text NOT NULL,
	"time" text NOT NULL,
	"scheduledDays" integer,
	"scheduledHours" integer,
	"scheduledMinutes" integer,
	"templateId" text NOT NULL,
	"active" boolean DEFAULT true,
	"minCartValue" integer NOT NULL,
	"maxCartValue" integer NOT NULL,
	"city" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status_code" text NOT NULL,
	"name" text NOT NULL,
	"time" text NOT NULL,
	"scheduledDays" integer,
	"scheduledHours" integer,
	"scheduledMinutes" integer,
	"to" text NOT NULL,
	"templateId" text NOT NULL,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bankTransfer" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alertId" text NOT NULL,
	"messageAfterFirstButtonId" text NOT NULL,
	"messageAfterSecondButtonId" text NOT NULL,
	"errorMessageId" text NOT NULL,
	"statusErrorMessageId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bots" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"messageId" text NOT NULL,
	"errorMessageId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'Running',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"excel" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phone" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"has_whatsapp" boolean DEFAULT true,
	"blocked_campaigns" boolean DEFAULT false,
	"blocked_from_bot" boolean DEFAULT false,
	"blocked_from_cc" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "errorMessages" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"bodyMessage" text NOT NULL,
	"bodyEnding" text,
	"header" boolean NOT NULL,
	"headerType" text,
	"headerText" text,
	"footer" boolean NOT NULL,
	"footerText" text,
	"status" text DEFAULT 'Pending',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interactiveWords" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"word" text NOT NULL,
	"filter" text NOT NULL,
	"status" text DEFAULT 'Pending',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"nodeId" text,
	"botId" text,
	"messageId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "linkedMessages" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"bodyMessage" text NOT NULL,
	"bodyEnding" text,
	"header" boolean NOT NULL,
	"headerType" text,
	"headerText" text,
	"footer" boolean NOT NULL,
	"footerText" text,
	"status" text DEFAULT 'Pending',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"nodeId" text,
	"botId" text,
	"activated" boolean DEFAULT true,
	"position" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'running',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"campaign_id" text NOT NULL,
	"sendingType" text,
	"ignoreCustomersReceiveMessageWithin" text,
	"dailyLimit" integer,
	"dailySendingLimit" integer,
	"fromSr" integer,
	"toSr" integer,
	"type" text,
	"scheduleDate" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"bodyMessage" text NOT NULL,
	"bodyEnding" text,
	"header" boolean NOT NULL,
	"headerType" text,
	"headerText" text,
	"footer" boolean NOT NULL,
	"footerText" text,
	"status" text DEFAULT 'Pending',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newLogin" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alertId" text NOT NULL,
	"templateId" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nodes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"botId" text NOT NULL,
	"messageId" text NOT NULL,
	"errorMessageId" text NOT NULL,
	"parentId" text,
	"index" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payOnReceive" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alertId" text NOT NULL,
	"messageAfterFirstButtonId" text NOT NULL,
	"messageAfterSecondButtonId" text NOT NULL,
	"errorMessageId" text NOT NULL,
	"statusErrorMessageId" text NOT NULL,
	"confirmationStatus" text NOT NULL,
	"cancellationStatus" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "receiverGift" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alertId" text NOT NULL,
	"messageAfterFirstButtonId" text NOT NULL,
	"messageAfterSecondButtonId" text NOT NULL,
	"errorMessageId" text NOT NULL,
	"statusErrorMessageId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateButtonTypes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateButtons" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"url" text,
	"phonenumber" text,
	"typeId" integer NOT NULL,
	"templateId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateCategories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateFooters" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateHeaderTypes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateHeaders" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text,
	"typeId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateLanguages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateTypes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"allowCategoryChange" boolean NOT NULL,
	"categoryId" text NOT NULL,
	"typeId" text NOT NULL,
	"languageId" text NOT NULL,
	"headerId" text,
	"bodyMessage" text NOT NULL,
	"footerId" text,
	"status" text DEFAULT 'Pending',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lists" ADD CONSTRAINT "lists_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
