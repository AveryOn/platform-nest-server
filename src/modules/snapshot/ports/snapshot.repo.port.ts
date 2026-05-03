import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type {
  ProjectSnapshotEntity,
  ProjectSnapshotRes,
  SnapshotRepoCmd,
} from '~/modules/snapshot/application/snapshot.type'

export const SNAPSHOT_REPO_PORT = Symbol('SNAPSHOT_REPO_PORT')

export abstract class SnapshotRepoPort {
  abstract create(
    cmd: SnapshotRepoCmd.Create,
    tx?: TransactionContext,
  ): Promise<ProjectSnapshotEntity>

  abstract getList(
    cmd: SnapshotRepoCmd.GetList,
    tx?: TransactionContext,
  ): Promise<ProjectSnapshotRes.GetList>

  abstract getById(
    cmd: SnapshotRepoCmd.GetById,
    tx?: TransactionContext,
  ): Promise<ProjectSnapshotEntity | null>

  abstract getByVersion(
    cmd: SnapshotRepoCmd.GetByVersion,
    tx?: TransactionContext,
  ): Promise<ProjectSnapshotEntity | null>

  abstract getPayload(
    cmd: SnapshotRepoCmd.GetPayload,
    tx?: TransactionContext,
  ): Promise<ProjectSnapshotRes.GetPayload | null>

  abstract getLatest(
    cmd: SnapshotRepoCmd.GetLatest,
    tx?: TransactionContext,
  ): Promise<ProjectSnapshotEntity | null>

  abstract getNextVersion(
    cmd: SnapshotRepoCmd.GetNextVersion,
    tx?: TransactionContext,
  ): Promise<number>
}
