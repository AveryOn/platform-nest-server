import { Injectable } from "@nestjs/common";
import { DrizzleService } from "~/infra/drizzle/drizzle.service";
import { ProjectRepoPort } from "~/modules/project/ports/project.repo.port";

@Injectable()
export class ProjectDrizzleRepo implements ProjectRepoPort {
  constructor(
    private readonly drizzle: DrizzleService,
  ) {}

}
