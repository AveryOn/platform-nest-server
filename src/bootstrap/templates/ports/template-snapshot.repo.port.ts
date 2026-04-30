import type {
  CreateTemplateSnapshotCmd,
  TemplateSnapshotRecord,
} from '~/bootstrap/templates/application/service/template.types'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'

export const TEMPLATE_SNAPSHOT_REPO_PORT = Symbol(
  'TEMPLATE_SNAPSHOT_REPO_PORT',
)

export abstract class TemplateSnapshotRepoPort {
  abstract findLatestByTemplateId(
    templateId: string,
    tx?: TransactionContext,
  ): Promise<TemplateSnapshotRecord | null>

  abstract create(
    cmd: CreateTemplateSnapshotCmd,
    tx?: TransactionContext,
  ): Promise<TemplateSnapshotRecord>
}
