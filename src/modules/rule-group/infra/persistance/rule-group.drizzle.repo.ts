import { Injectable } from "@nestjs/common";
import { DrizzleService } from "~/infra/drizzle/drizzle.service";
import { RuleGroupRepoPort } from "~/modules/rule-group/ports/rule-group.repo.port";

@Injectable()
export class RuleGroupDrizzleRepo implements RuleGroupRepoPort {
  constructor(
    private readonly drizzle: DrizzleService,
  ) {}

}
