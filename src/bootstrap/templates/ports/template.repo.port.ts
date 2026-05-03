import type {
  CreateTemplateCmd,
  TemplateRecord,
  UpdateTemplateMetaCmd,
} from '~/bootstrap/templates/application/service/template.types'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'

export const TEMPLATE_REPO_PORT = Symbol('TEMPLATE_REPO_PORT')

export abstract class TemplateRepoPort {
  abstract findBySlug(
    slug: string,
    tx?: TransactionContext,
  ): Promise<TemplateRecord | null>

  abstract create(
    cmd: CreateTemplateCmd,
    tx?: TransactionContext,
  ): Promise<TemplateRecord>

  abstract updateMeta(
    cmd: UpdateTemplateMetaCmd,
    tx?: TransactionContext,
  ): Promise<TemplateRecord>
}
