CREATE TYPE "public"."rule_scope" AS ENUM('template', 'project');--> statement-breakpoint
DROP INDEX "rule_groups_project_parent_order_unique";--> statement-breakpoint
DROP INDEX "rules_group_order_unique";--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rules" ADD COLUMN "scope" "rule_scope" DEFAULT 'project' NOT NULL;--> statement-breakpoint
ALTER TABLE "template_snapshots" ADD COLUMN "hash" varchar(64) NOT NULL;--> statement-breakpoint
CREATE INDEX "rules_group_order_idx" ON "rules" USING btree ("rule_group_id","order_index");--> statement-breakpoint
CREATE INDEX "rules_project_idx" ON "rules" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rule_groups_project_parent_order_unique" ON "rule_groups" USING btree ("project_id","parent_group_id","order_index") WHERE "rule_groups"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "rules_group_order_unique" ON "rules" USING btree ("rule_group_id","order_index") WHERE "rules"."deleted_at" is null;