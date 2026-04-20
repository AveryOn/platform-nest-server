import { Module } from '@nestjs/common'
import { ProjectController } from '~/modules/project/infra/http/project.controller'

@Module({
  controllers: [ProjectController],
  exports: [],
})
export class ProjectModule {}
