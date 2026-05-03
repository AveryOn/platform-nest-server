CREATE TYPE "public"."api_key_mode_enum" AS ENUM('READ_ONLY', 'WRITABLE');--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "mode" "api_key_mode_enum" DEFAULT 'READ_ONLY' NOT NULL;