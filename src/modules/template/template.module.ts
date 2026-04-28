import { Module } from '@nestjs/common'
import { TemplateService } from '~/modules/template/application/template.service'
import { TemplateController } from '~/modules/template/infra/http/template.controller'
import { TemplateDrizzleRepo } from '~/modules/template/infra/persistence/template.drizzle.repo'
import { TEMPLATE_REPO_PORT } from '~/modules/template/ports/template.repo.port'
import { TEMPLATE_SERVICE_PORT } from '~/modules/template/ports/template.service.port'

@Module({
  controllers: [TemplateController],
  providers: [
    {
      provide: TEMPLATE_SERVICE_PORT,
      useClass: TemplateService,
    },
    {
      provide: TEMPLATE_REPO_PORT,
      useClass: TemplateDrizzleRepo,
    },
  ],
  exports: [TEMPLATE_SERVICE_PORT],
})
export class TemplateModule {}
