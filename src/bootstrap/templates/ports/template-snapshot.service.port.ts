import type {
  TemplateBase,
  TemplateSeedApplyResult,
  TemplateSeedCheckApplyResult,
  TemplateSeedDiffApplyResult,
  TemplateSeedDryRunApplyResult,
  TemplateSnapshotPayload,
} from '~/bootstrap/templates/application/service/template.types'

export const TEMPLATE_SNAPSHOT_SERVICE_PORT = Symbol(
  'TEMPLATE_SNAPSHOT_SERVICE_PORT',
)

export abstract class TemplateSnapshotServicePort {
  abstract applyTemplates(): Promise<TemplateSeedApplyResult>
  abstract checkTemplates(): Promise<TemplateSeedCheckApplyResult>
  abstract dryRunTemplates(): Promise<TemplateSeedDryRunApplyResult>
  abstract diffTemplates(): Promise<TemplateSeedDiffApplyResult>
  abstract buildPayload(source: TemplateBase): TemplateSnapshotPayload
}
