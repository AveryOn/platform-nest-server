import { Module } from '@nestjs/common'
import { TemplateController } from '~/modules/template/infra/http/template.controller'

@Module({
  controllers: [TemplateController],
  exports: [],
})
export class TemplateModule {}
