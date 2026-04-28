import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type {
  ProjectRepoCmd,
  ProjectRepoRes,
} from '~/modules/project/application/project.type'

export const PROJECT_REPO_PORT = Symbol('PROJECT_REPO_PORT')

export abstract class ProjectRepoPort {
  abstract getList(
    cmd: ProjectRepoCmd.GetList,
    tx?: TransactionContext,
  ): Promise<ProjectRepoRes.GetList>

  abstract getById(
    cmd: ProjectRepoCmd.GetById,
    tx?: TransactionContext,
  ): Promise<ProjectRepoRes.GetById>

  abstract create(
    cmd: ProjectRepoCmd.Create,
    tx?: TransactionContext,
  ): Promise<ProjectRepoRes.Create>

  abstract update(
    cmd: ProjectRepoCmd.Update,
    tx?: TransactionContext,
  ): Promise<ProjectRepoRes.Update>

  abstract delete(
    cmd: ProjectRepoCmd.Delete,
    tx?: TransactionContext,
  ): Promise<ProjectRepoRes.Delete>
}
