import type {
  TemplateBase,
  TemplateSeedApplyResult,
  TemplateSnapshotPayload,
} from '~/bootstrap/templates/application/service/template.types'

export const TEMPLATE_SNAPSHOT_SERVICE_PORT = Symbol(
  'TEMPLATE_SNAPSHOT_SERVICE_PORT',
)

export abstract class TemplateSnapshotServicePort {
  abstract applyTemplates(): Promise<TemplateSeedApplyResult>
  abstract buildPayload(source: TemplateBase): TemplateSnapshotPayload
}
