import { Module } from '@nestjs/common'
import { SnapshotController } from '~/modules/snapshot/infra/http/snapshot.controller'

@Module({
  controllers: [SnapshotController],
  exports: [],
})
export class SnapshotModule {}
