CREATE TYPE "public"."api_key_mode_enum" AS ENUM('READ_ONLY', 'WRITABLE');--> statement-breakpoint
CREATE TYPE "public"."api_key_status_enum" AS ENUM('ACTIVE', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."project_rule_config_status" AS ENUM('active', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."project_rule_group_config_status" AS ENUM('active', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."rule_group_scope" AS ENUM('template', 'project');--> statement-breakpoint
CREATE TYPE "public"."rule_group_type" AS ENUM('category', 'token', 'section', 'component', 'variant');--> statement-breakpoint
CREATE TYPE "public"."rule_scope" AS ENUM('template', 'project');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand_id" uuid NOT NULL,
	"project_id" uuid,
	"organization_id" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" varchar(64) NOT NULL,
	"mode" "api_key_mode_enum" DEFAULT 'READ_ONLY' NOT NULL,
	"scopes" jsonb DEFAULT '["project:read","ruleset:read","snapshot:read","snapshot:payload:read","export:read"]'::jsonb NOT NULL,
	"status" "api_key_status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"last_used_ip" varchar(64),
	"last_used_ua" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now(),
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_rule_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"rule_id" uuid NOT NULL,
	"status" "project_rule_config_status" DEFAULT 'active' NOT NULL,
	"replaced_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_rule_group_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"rule_group_id" uuid NOT NULL,
	"status" "project_rule_group_config_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_rule_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"comment" varchar(255),
	"version" integer NOT NULL,
	"payload" jsonb NOT NULL,
	"hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"brand_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"template_snapshot_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rule_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"parent_group_id" uuid,
	"scope" "rule_group_scope" DEFAULT 'project' NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"type" "rule_group_type",
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"rule_group_id" uuid NOT NULL,
	"scope" "rule_scope" DEFAULT 'project' NOT NULL,
	"order_index" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"metadata" jsonb,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "template_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"payload" jsonb NOT NULL,
	"hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rule_configs" ADD CONSTRAINT "project_rule_configs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rule_configs" ADD CONSTRAINT "project_rule_configs_rule_id_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rule_configs" ADD CONSTRAINT "project_rule_configs_replaced_by_rules_id_fk" FOREIGN KEY ("replaced_by") REFERENCES "public"."rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rule_group_configs" ADD CONSTRAINT "project_rule_group_configs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rule_group_configs" ADD CONSTRAINT "project_rule_group_configs_rule_group_id_rule_groups_id_fk" FOREIGN KEY ("rule_group_id") REFERENCES "public"."rule_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rule_snapshots" ADD CONSTRAINT "project_rule_snapshots_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_template_snapshot_id_template_snapshots_id_fk" FOREIGN KEY ("template_snapshot_id") REFERENCES "public"."template_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rule_groups" ADD CONSTRAINT "rule_groups_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rule_groups" ADD CONSTRAINT "rule_groups_parent_group_id_fkey" FOREIGN KEY ("parent_group_id") REFERENCES "public"."rule_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rules" ADD CONSTRAINT "rules_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rules" ADD CONSTRAINT "rules_rule_group_id_rule_groups_id_fk" FOREIGN KEY ("rule_group_id") REFERENCES "public"."rule_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_snapshots" ADD CONSTRAINT "template_snapshots_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_hash_uidx" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_name_org_uidx" ON "api_keys" USING btree ("name","organization_id");--> statement-breakpoint
CREATE INDEX "api_key_key_prefix_idx" ON "api_keys" USING btree ("key_prefix");--> statement-breakpoint
CREATE INDEX "api_key_created_by_user_id_idx" ON "api_keys" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "api_key_org_brand_idx" ON "api_keys" USING btree ("organization_id","brand_id");--> statement-breakpoint
CREATE INDEX "api_key_project_org_brand_idx" ON "api_keys" USING btree ("project_id","organization_id","brand_id");--> statement-breakpoint
CREATE INDEX "api_key_status_idx" ON "api_keys" USING btree ("status");--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invitations_organizationId_idx" ON "invitations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitations_email_idx" ON "invitations" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_id_email_status_uidx" ON "invitations" USING btree ("organization_id","email","status");--> statement-breakpoint
CREATE INDEX "members_organizationId_idx" ON "members" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "members_userId_idx" ON "members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_id_user_id_uidx" ON "members" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_slug_uidx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "brands_organization_id_idx" ON "brands" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_organization_id_title_uidx" ON "brands" USING btree ("organization_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "prc_project_rule_unique" ON "project_rule_configs" USING btree ("project_id","rule_id");--> statement-breakpoint
CREATE INDEX "prc_project_status_idx" ON "project_rule_configs" USING btree ("project_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "prgc_project_rule_group_unique" ON "project_rule_group_configs" USING btree ("project_id","rule_group_id");--> statement-breakpoint
CREATE INDEX "prgc_project_status_idx" ON "project_rule_group_configs" USING btree ("project_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "p_r_snapshots_p_ver_unique" ON "project_rule_snapshots" USING btree ("project_id","version");--> statement-breakpoint
CREATE INDEX "p_r_snapshots_p_idx" ON "project_rule_snapshots" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug","brand_id");--> statement-breakpoint
CREATE INDEX "projects_organization_deleted_idx" ON "projects" USING btree ("organization_id","deleted_at");--> statement-breakpoint
CREATE INDEX "projects_template_snapshot_idx" ON "projects" USING btree ("template_snapshot_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rule_groups_project_parent_order_unique" ON "rule_groups" USING btree ("project_id","parent_group_id","order_index") WHERE "rule_groups"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "rule_groups_project_parent_order_idx" ON "rule_groups" USING btree ("project_id","parent_group_id","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "rules_group_order_unique" ON "rules" USING btree ("rule_group_id","order_index") WHERE "rules"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "rules_group_order_idx" ON "rules" USING btree ("rule_group_id","order_index");--> statement-breakpoint
CREATE INDEX "rules_project_idx" ON "rules" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ts_t_version_unique" ON "template_snapshots" USING btree ("template_id","version");--> statement-breakpoint
CREATE INDEX "ts_t_idx" ON "template_snapshots" USING btree ("template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "templates_slug_unique" ON "templates" USING btree ("slug");