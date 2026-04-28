import { Module } from '@nestjs/common'
import { ProjectConfigService } from '~/modules/project-config/application/project-config.service'
import { ProjectConfigController } from '~/modules/project-config/infra/http/project-config.controller'
import { ProjectConfigDrizzleRepo } from '~/modules/project-config/infra/persistence/project-config.drizzle.repo'
import { PROJECT_CONFIG_REPO_PORT } from '~/modules/project-config/ports/project-config.repo.port'
import { PROJECT_CONFIG_SERVICE_PORT } from '~/modules/project-config/ports/project-config.service.port'

@Module({
  controllers: [ProjectConfigController],
  providers: [
    {
      provide: PROJECT_CONFIG_SERVICE_PORT,
      useClass: ProjectConfigService,
    },
    {
      provide: PROJECT_CONFIG_REPO_PORT,
      useClass: ProjectConfigDrizzleRepo,
    },
  ],
  exports: [PROJECT_CONFIG_SERVICE_PORT],
})
export class ProjectConfigModule {}
