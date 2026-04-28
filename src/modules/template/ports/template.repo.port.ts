import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type {
  TemplateRepoCmd,
  TemplateRepoRes,
} from '~/modules/template/application/template.type'

export const TEMPLATE_REPO_PORT = Symbol('TEMPLATE_REPO_PORT')

export abstract class TemplateRepoPort {
  abstract getList(
    cmd: TemplateRepoCmd.getList,
    tx?: TransactionContext,
  ): Promise<TemplateRepoRes.getList>

  abstract getById(
    cmd: TemplateRepoCmd.getById,
    tx?: TransactionContext,
  ): Promise<TemplateRepoRes.getById>

  abstract getSnapshotList(
    cmd: TemplateRepoCmd.getSnapshotList,
    tx?: TransactionContext,
  ): Promise<TemplateRepoRes.getSnapshotList>
}
