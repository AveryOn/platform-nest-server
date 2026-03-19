import { Injectable } from "@nestjs/common";
import { DrizzleService } from "~/infra/drizzle/drizzle.service";
import { TemplateSnapshotRepoPort } from "~/modules/template-snapshot/ports/template-snapshot.repo.port";

@Injectable()
export class TemplateSnapshotDrizzleRepo implements TemplateSnapshotRepoPort {
  constructor(
    private readonly drizzle: DrizzleService,
  ) {}

}