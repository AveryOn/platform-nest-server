import { Module } from "@nestjs/common";
import { PROJECT_PORT } from "~/modules/project/ports/project.service.port";
import { ProjectController } from "~/modules/project/infra/http/project.controller";
import { PROJECT_REPO_PORT } from "~/modules/project/ports/project.repo.port";
import { ProjectDrizzleRepo } from "~/modules/project/infra/persistance/project.drizzle.repo";
import { ProjectService } from "~/modules/project/application/project.service";

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_PORT,
      useClass: ProjectService,
    },
    {
      provide: PROJECT_REPO_PORT,
      useClass: ProjectDrizzleRepo,
    },
  ],
  exports: [PROJECT_PORT],
})
export class ProjectModule {}
