import { Module } from '@nestjs/common'
import { TEMPLATE_PORT } from '~/modules/template/ports/template.service.port'
import { TemplateController } from '~/modules/template/infra/http/template.controller'
import { TEMPLATE_REPO_PORT } from '~/modules/template/ports/template.repo.port'
import { TemplateDrizzleRepo } from '~/modules/template/infra/persistance/template.drizzle.repo'
import { TemplateService } from '~/modules/template/application/template.service'

@Module({
  controllers: [TemplateController],
  providers: [
    {
      provide: TEMPLATE_PORT,
      useClass: TemplateService,
    },
    {
      provide: TEMPLATE_REPO_PORT,
      useClass: TemplateDrizzleRepo,
    },
  ],
  exports: [TEMPLATE_PORT],
})
export class TemplateModule {}
