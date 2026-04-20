import { Module } from '@nestjs/common'
import { ProjectConfigController } from '~/modules/project-config/infra/http/project-config.controller'

@Module({
  controllers: [ProjectConfigController],
  exports: [],
})
export class ProjectConfigModule {}
