import { Module } from '@nestjs/common'
import { ExportService } from '~/modules/export/application/export.service'
import { ExportController } from '~/modules/export/infra/http/export.controller'
import { ExportDrizzleRepo } from '~/modules/export/infra/persistence/drizzle.export.repo'
import { EXPORT_REPO_PORT } from '~/modules/export/ports/export.repo.port'
import { EXPORT_SERVICE_PORT } from '~/modules/export/ports/export.service.port'

@Module({
  controllers: [ExportController],
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
