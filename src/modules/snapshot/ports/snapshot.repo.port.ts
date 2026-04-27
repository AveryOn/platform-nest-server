import type {
  ProjectSnapshotEntity,
  ProjectSnapshotRes,
  SnapshotRepoCmd,
} from '~/modules/snapshot/application/snapshot.type'

export const SNAPSHOT_REPO_PORT = Symbol('SNAPSHOT_REPO_PORT')

export abstract class SnapshotRepoPort {
  abstract create(
    cmd: SnapshotRepoCmd.Create,
  ): Promise<ProjectSnapshotEntity>

  abstract getList(
    cmd: SnapshotRepoCmd.GetList,
  ): Promise<ProjectSnapshotRes.GetList>

  abstract getById(
    cmd: SnapshotRepoCmd.GetById,
  ): Promise<ProjectSnapshotEntity | null>

  abstract getByVersion(
    cmd: SnapshotRepoCmd.GetByVersion,
  ): Promise<ProjectSnapshotEntity | null>

  abstract getPayload(
    cmd: SnapshotRepoCmd.GetPayload,
  ): Promise<ProjectSnapshotRes.GetPayload | null>

  abstract getLatest(
    cmd: SnapshotRepoCmd.GetLatest,
  ): Promise<ProjectSnapshotEntity | null>

  abstract getNextVersion(
    cmd: SnapshotRepoCmd.GetNextVersion,
  ): Promise<number>
}
