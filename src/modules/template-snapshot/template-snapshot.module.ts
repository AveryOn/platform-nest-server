import { Module } from '@nestjs/common'
import { TEMPLATE_SNAPSHOT_PORT } from '~/modules/template-snapshot/ports/template-snapshot.service.port'
import { TemplateSnapshotController } from '~/modules/template-snapshot/infra/http/template-snapshot.controller'
import { TEMPLATE_SNAPSHOT_REPO_PORT } from '~/modules/template-snapshot/ports/template-snapshot.repo.port'
import { TemplateSnapshotDrizzleRepo } from '~/modules/template-snapshot/infra/persistance/template-snapshot.drizzle.repo'
import { TemplateSnapshotService } from '~/modules/template-snapshot/application/template-snapshot.service'

@Module({
  controllers: [TemplateSnapshotController],
  providers: [
    {
      provide: TEMPLATE_SNAPSHOT_PORT,
      useClass: TemplateSnapshotService,
    },
    {
      provide: TEMPLATE_SNAPSHOT_REPO_PORT,
      useClass: TemplateSnapshotDrizzleRepo,
    },
  ],
  exports: [TEMPLATE_SNAPSHOT_PORT],
})
export class TemplateSnapshotModule {}
