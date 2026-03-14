import { Module } from '@nestjs/common'
import { SystemController } from '~/modules/system/infra/http/system.controller'

@Module({
  controllers: [SystemController],
  providers: [],
})
export class SystemModule {}
