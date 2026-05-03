DROP INDEX "organization_id_email_status_uidx";--> statement-breakpoint
DROP INDEX "organization_id_user_id_uidx";--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "scopes" SET DEFAULT '["project:read","ruleset:read","snapshot:read","snapshot:payload:read","export:read"]'::jsonb;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_id_email_status_uidx" ON "invitations" USING btree ("organization_id","email","status");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_id_user_id_uidx" ON "members" USING btree ("organization_id","user_id");