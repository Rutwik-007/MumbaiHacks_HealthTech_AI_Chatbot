-- Add role column (skip if already exists)
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "role" varchar(20) DEFAULT 'citizen' NOT NULL;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;--> statement-breakpoint
-- Add name column (skip if already exists)
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "name" varchar(128);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;--> statement-breakpoint
-- Add phone column (skip if already exists)
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "phone" varchar(15);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;--> statement-breakpoint
-- Add district column (skip if already exists)
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "district" varchar(64);
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;--> statement-breakpoint
-- Add createdAt column (skip if already exists)
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN "createdAt" timestamp DEFAULT now();
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;