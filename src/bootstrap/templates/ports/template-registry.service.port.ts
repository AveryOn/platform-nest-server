import type { TemplateBase } from '~/bootstrap/templates/application/service/template.types'

export const TEMPLATE_REGISTRY_SERVICE_PORT = Symbol(
  'TEMPLATE_REGISTRY_SERVICE_PORT',
)

export abstract class TemplateRegistryServicePort {
  abstract getTemplates(): TemplateBase[]
}
