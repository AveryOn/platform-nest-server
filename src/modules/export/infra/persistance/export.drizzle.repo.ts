import { Injectable } from "@nestjs/common";
import { DrizzleService } from "~/infra/drizzle/drizzle.service";
import { ExportRepoPort } from "~/modules/export/ports/export.repo.port";

@Injectable()
export class ExportDrizzleRepo implements ExportRepoPort {
  constructor(
    private readonly drizzle: DrizzleService,
  ) {}

}