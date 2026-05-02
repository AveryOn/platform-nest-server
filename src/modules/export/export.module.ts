import { Module } from '@nestjs/common'
import { AuthModule } from '~/modules/auth/auth.module'
import { ExportService } from '~/modules/export/application/export.service'
import { ExportController } from '~/modules/export/infra/http/export.controller'
import { EXPORT_SERVICE_PORT } from '~/modules/export/ports/export.service.port'
import { ProjectModule } from '~/modules/project/project.module'
import { ResolvedRulesetModule } from '~/modules/resolved-ruleset/resolved-ruleset.module'
import { SnapshotModule } from '~/modules/snapshot/snapshot.module'

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
  ],
  exports: [EXPORT_SERVICE_PORT],
})
export class ExportModule {}
