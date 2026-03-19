import { Injectable } from "@nestjs/common";
import { DrizzleService } from "~/infra/drizzle/drizzle.service";
import { TemplateRepoPort } from "~/modules/template/ports/template.repo.port";

@Injectable()
export class TemplateDrizzleRepo implements TemplateRepoPort {
  constructor(
    private readonly drizzle: DrizzleService,
  ) {}

}