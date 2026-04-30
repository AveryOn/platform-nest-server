import { Injectable } from '@nestjs/common'
import type { TemplateBase } from '~/bootstrap/templates/application/service/template.types'
import { shadcnTemplate } from '~/bootstrap/templates/assets/shadcn.template'
import type { TemplateRegistryServicePort } from '~/bootstrap/templates/ports/template-registry.service.port'

@Injectable()
export class TemplateSourceService implements TemplateRegistryServicePort {
  getTemplates(): TemplateBase[] {
    return [shadcnTemplate]
  }
}
