import { Module } from '@nestjs/common'
import { PROJECT_PORT } from '~/modules/project/ports/project.service.port'
import { ProjectController } from '~/modules/project/infra/http/project.controller'
import { PROJECT_REPO_PORT } from '~/modules/project/ports/project.repo.port'
import { ProjectDrizzleRepo } from '~/modules/project/infra/persistance/project.drizzle.repo'
import { ProjectService } from '~/modules/project/application/project.service'
import { RuleModule } from '../rule/rule.module'
import { RuleGroupModule } from '../rule-group/rule-group.module'
import { TreeModule } from '../tree/tree.module'
import { ExportModule } from '../export/export.module'

@Module({
  imports: [RuleModule, RuleGroupModule, TreeModule, ExportModule],
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
