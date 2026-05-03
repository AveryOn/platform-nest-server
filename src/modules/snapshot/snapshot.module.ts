import { Module } from '@nestjs/common'
import { ApiKeyModule } from '~/modules/api-key/api-key.module'
import { AuthModule } from '~/modules/auth/auth.module'
import { BrandModule } from '~/modules/brand/brand.module'
import { ProjectModule } from '~/modules/project/project.module'
import { ResolvedRulesetModule } from '~/modules/resolved-ruleset/resolved-ruleset.module'
import { SnapshotPayloadBuilder } from '~/modules/snapshot/application/snapshot-payload-builder.service'
import { SnapshotService } from '~/modules/snapshot/application/snapshot.service'
import { SnapshotController } from '~/modules/snapshot/infra/http/snapshot.controller'
import { SnapshotDrizzleRepo } from '~/modules/snapshot/infra/persistence/snapshot.drizzle.repo'
import { SNAPSHOT_PAYLOAD_BUILDER_PORT } from '~/modules/snapshot/ports/snapshot-payload-builder.port'
import { SNAPSHOT_REPO_PORT } from '~/modules/snapshot/ports/snapshot.repo.port'
import { SNAPSHOT_SERVICE_PORT } from '~/modules/snapshot/ports/snapshot.service.port'

@Module({
  imports: [
    ResolvedRulesetModule,
    BrandModule,
    AuthModule,
    ApiKeyModule,
    ProjectModule,
  ],
  controllers: [SnapshotController],
  providers: [
    {
      provide: SNAPSHOT_SERVICE_PORT,
      useClass: SnapshotService,
    },
    {
      provide: SNAPSHOT_REPO_PORT,
      useClass: SnapshotDrizzleRepo,
    },
    {
      provide: SNAPSHOT_PAYLOAD_BUILDER_PORT,
      useClass: SnapshotPayloadBuilder,
    },
  ],
  exports: [SNAPSHOT_SERVICE_PORT, SNAPSHOT_PAYLOAD_BUILDER_PORT],
})
export class SnapshotModule {}
