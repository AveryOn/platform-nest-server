import { Module } from '@nestjs/common'
import { TreeController } from '~/modules/tree/infra/http/tree.controller'

@Module({
  controllers: [TreeController],
  exports: [],
})
export class TreeModule {}
