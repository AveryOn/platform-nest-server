import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type {
  ApiKeyRepoCmd,
  ApiKeyRepoRes,
} from '~/modules/api-key/application/api-key.type'

export const API_KEY_REPO_PORT = Symbol('API_KEY_REPO_PORT')

export abstract class ApiKeyRepoPort {
  abstract create(
    cmd: ApiKeyRepoCmd.Create,
    tx?: TransactionContext,
  ): Promise<ApiKeyRepoRes.Create>

  abstract getList(
    cmd: ApiKeyRepoCmd.GetList,
    tx?: TransactionContext,
  ): Promise<ApiKeyRepoRes.GetList>

  abstract getById(
    cmd: ApiKeyRepoCmd.GetById,
    tx?: TransactionContext,
  ): Promise<ApiKeyRepoRes.GetById>

  abstract findByName(
    cmd: ApiKeyRepoCmd.FindByName,
    tx?: TransactionContext,
  ): Promise<ApiKeyRepoRes.FindByName>

  abstract findByHash(
    cmd: ApiKeyRepoCmd.FindByHash,
    tx?: TransactionContext,
  ): Promise<ApiKeyRepoRes.FindByHash>

  abstract markUsed(
    cmd: ApiKeyRepoCmd.MarkUsed,
    tx?: TransactionContext,
  ): Promise<void>

  abstract revoke(
    cmd: ApiKeyRepoCmd.Revoke,
    tx?: TransactionContext,
  ): Promise<ApiKeyRepoRes.Revoke>
}
