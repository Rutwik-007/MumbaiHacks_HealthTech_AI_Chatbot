DO $$ BEGIN
 CREATE TYPE "public"."health_category" AS ENUM('pregnancy', 'vaccines', 'dengue', 'malaria', 'nutrition', 'emergency', 'child_health', 'maternal_health', 'general');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."language" AS ENUM('en', 'hi', 'mr', 'pa');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."reminder_type" AS ENUM('vaccine', 'antenatal', 'followup', 'medication', 'seasonal_alert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."risk_level" AS ENUM('low', 'medium', 'high', 'emergency');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('citizen', 'asha', 'officer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AshaVisit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ashaUserId" uuid NOT NULL,
	"householdId" varchar(100) NOT NULL,
	"householdName" varchar(255),
	"visitDate" timestamp NOT NULL,
	"visitType" varchar(50),
	"summary" text,
	"riskChecklist" json,
	"referrals" json,
	"followUpTasks" json,
	"membersChecked" integer,
	"pregnantWomen" integer,
	"childrenUnder5" integer,
	"language" "language" DEFAULT 'en',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ConversationAnalytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"detectedLanguage" "language",
	"userRole" "user_role",
	"intentCategory" varchar(100),
	"topics" json,
	"healthCategories" json,
	"hasEmergency" boolean DEFAULT false,
	"riskLevel" "risk_level",
	"region" varchar(100),
	"messageCount" integer DEFAULT 0,
	"tokensUsed" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DocumentChunk" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"documentId" uuid NOT NULL,
	"chunkIndex" integer NOT NULL,
	"content" text NOT NULL,
	"tokenCount" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"chatId" uuid,
	"rating" integer,
	"comment" text,
	"category" varchar(50),
	"isResolved" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HealthAlert" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "health_category" NOT NULL,
	"severity" "risk_level" NOT NULL,
	"region" varchar(100),
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"isActive" boolean DEFAULT true NOT NULL,
	"affectedDistricts" json,
	"preventionTips" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HealthDocument" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"category" "health_category" DEFAULT 'general' NOT NULL,
	"language" "language" DEFAULT 'en' NOT NULL,
	"source" varchar(255),
	"sourceUrl" text,
	"version" integer DEFAULT 1 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"tags" json,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Reminder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"type" "reminder_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"scheduledAt" timestamp NOT NULL,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"isSent" boolean DEFAULT false NOT NULL,
	"sentAt" timestamp,
	"language" "language" DEFAULT 'en' NOT NULL,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RiskAssessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"symptoms" json NOT NULL,
	"severityScore" integer NOT NULL,
	"riskLevel" "risk_level" NOT NULL,
	"isEmergency" boolean DEFAULT false NOT NULL,
	"recommendations" json,
	"aiAnalysis" text,
	"userAge" integer,
	"isPregnant" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserProfile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"role" "user_role" DEFAULT 'citizen' NOT NULL,
	"preferredLanguage" "language" DEFAULT 'en' NOT NULL,
	"region" varchar(100),
	"district" varchar(100),
	"village" varchar(100),
	"phoneNumber" varchar(15),
	"isPregnant" boolean DEFAULT false,
	"pregnancyWeeks" integer,
	"hasChildren" boolean DEFAULT false,
	"childrenAges" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AshaVisit" ADD CONSTRAINT "AshaVisit_ashaUserId_User_id_fk" FOREIGN KEY ("ashaUserId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ConversationAnalytics" ADD CONSTRAINT "ConversationAnalytics_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ConversationAnalytics" ADD CONSTRAINT "ConversationAnalytics_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_documentId_HealthDocument_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."HealthDocument"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
