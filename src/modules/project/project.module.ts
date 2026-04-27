import { Module } from '@nestjs/common'
import { ProjectService } from '~/modules/project/application/project.service'
import { ProjectController } from '~/modules/project/infra/http/project.controller'
import { ProjectDrizzleRepo } from '~/modules/project/infra/persistence/project.drizzle.repo'
import { PROJECT_REPO_PORT } from '~/modules/project/ports/project.repo.port'
import { PROJECT_SERVICE_PORT } from '~/modules/project/ports/project.service.port'

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_SERVICE_PORT,
      useClass: ProjectService,
    },
    {
      provide: PROJECT_REPO_PORT,
      useClass: ProjectDrizzleRepo,
    },
  ],
  exports: [PROJECT_SERVICE_PORT],
})
export class ProjectModule {}
