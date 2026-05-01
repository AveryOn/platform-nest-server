import { Module } from '@nestjs/common'
import { ExportService } from '~/modules/export/application/export.service'
import { ExportController } from '~/modules/export/infra/http/export.controller'
import { ExportDrizzleRepo } from '~/modules/export/infra/persistence/drizzle.export.repo'
import { EXPORT_REPO_PORT } from '~/modules/export/ports/export.repo.port'
import { EXPORT_SERVICE_PORT } from '~/modules/export/ports/export.service.port'
import { AuthModule } from '../auth/auth.module'
import { ProjectModule } from '../project/project.module'
import { ResolvedRulesetModule } from '../resolved-ruleset/resolved-ruleset.module'
import { SnapshotModule } from '../snapshot/snapshot.module'

@Module({
  controllers: [ExportController],
  imports: [
    SnapshotModule,
    ResolvedRulesetModule,
    ProjectModule,
    AuthModule,
  ],
  providers: [
    {
      provide: EXPORT_SERVICE_PORT,
      useClass: ExportService,
    },
    {
      provide: EXPORT_REPO_PORT,
      useClass: ExportDrizzleRepo,
    },
  ],
  exports: [EXPORT_SERVICE_PORT],
})
export class ExportModule {}
