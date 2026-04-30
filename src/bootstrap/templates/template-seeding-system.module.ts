import { Module } from '@nestjs/common'

import { TemplateSnapshotService } from '~/bootstrap/templates/application/service/template-snapshot.service'
import { TemplateSourceService } from '~/bootstrap/templates/application/service/template-source.service'
import { DrizzleTemplateSnapshotRepo } from '~/bootstrap/templates/infra/persistence/drizzle.template-snapshot.repo'
import { DrizzleTemplateRepo } from '~/bootstrap/templates/infra/persistence/drizzle.template.repo'
import { TEMPLATE_REGISTRY_SERVICE_PORT } from '~/bootstrap/templates/ports/template-registry.service.port'
import { TEMPLATE_SNAPSHOT_REPO_PORT } from '~/bootstrap/templates/ports/template-snapshot.repo.port'
import { TEMPLATE_REPO_PORT } from '~/bootstrap/templates/ports/template.repo.port'
import { TEMPLATE_SNAPSHOT_SERVICE_PORT } from './ports/template-snapshot.service.port'

@Module({
  providers: [
    TemplateSnapshotService,
    {
      provide: TEMPLATE_SNAPSHOT_SERVICE_PORT,
      useClass: TemplateSnapshotService,
    },
    {
      provide: TEMPLATE_REGISTRY_SERVICE_PORT,
      useClass: TemplateSourceService,
    },
    {
      provide: TEMPLATE_REPO_PORT,
      useClass: DrizzleTemplateRepo,
    },
    {
      provide: TEMPLATE_SNAPSHOT_REPO_PORT,
      useClass: DrizzleTemplateSnapshotRepo,
    },
  ],
  exports: [TEMPLATE_SNAPSHOT_SERVICE_PORT, TemplateSnapshotService],
})
export class TemplateSeedingSystemModule {}
