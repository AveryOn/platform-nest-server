import { Module } from '@nestjs/common'
import { SnapashotService } from '~/modules/snapshot/application/snapshot.service'
import { SnapshotController } from '~/modules/snapshot/infra/http/snapshot.controller'
import { SnapashotDrizzleRepo } from '~/modules/snapshot/infra/persistence/snapshot.drizzle.repo'
import { SNAPSHOT_REPO_PORT } from '~/modules/snapshot/ports/snapshot.repo.port'
import { SNAPSHOT_SERVICE_PORT } from '~/modules/snapshot/ports/snapshot.service.port'

@Module({
  controllers: [SnapshotController],
  providers: [
    {
      provide: SNAPSHOT_SERVICE_PORT,
      useClass: SnapashotService,
    },
    {
      provide: SNAPSHOT_REPO_PORT,
      useClass: SnapashotDrizzleRepo,
    },
  ],
  exports: [SNAPSHOT_SERVICE_PORT],
})
export class SnapshotModule {}
