CREATE TYPE "public"."api_key_status_enum" AS ENUM('ACTIVE', 'REVOKED');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand_id" uuid NOT NULL,
	"project_id" uuid,
	"organization_id" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" varchar(64) NOT NULL,
	"scopes" jsonb DEFAULT '["ruleset:read","snapshot:read","project:read"]'::jsonb NOT NULL,
	"status" "api_key_status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"last_used_ip" varchar(64),
	"last_used_ua" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now(),
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_hash_uidx" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_name_org_uidx" ON "api_keys" USING btree ("name","organization_id");--> statement-breakpoint
CREATE INDEX "api_key_key_prefix_idx" ON "api_keys" USING btree ("key_prefix");--> statement-breakpoint
CREATE INDEX "api_key_created_by_user_id_idx" ON "api_keys" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "api_key_org_brand_idx" ON "api_keys" USING btree ("organization_id","brand_id");--> statement-breakpoint
CREATE INDEX "api_key_project_org_brand_idx" ON "api_keys" USING btree ("project_id","organization_id","brand_id");--> statement-breakpoint
CREATE INDEX "api_key_status_idx" ON "api_keys" USING btree ("status");