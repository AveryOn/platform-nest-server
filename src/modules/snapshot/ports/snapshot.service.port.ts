import type {
  ProjectSnapshotReqCmd,
  ProjectSnapshotRes,
} from '~/modules/snapshot/application/snapshot.type'

export const SNAPSHOT_SERVICE_PORT = Symbol('SNAPSHOT_SERVICE_PORT')

export abstract class SnapshotServicePort {
  abstract getList(
    cmd: ProjectSnapshotReqCmd.GetList,
  ): Promise<ProjectSnapshotRes.GetList>

  abstract getById(
    cmd: ProjectSnapshotReqCmd.GetById,
  ): Promise<ProjectSnapshotRes.GetById>

  abstract getByVersion(
    cmd: ProjectSnapshotReqCmd.GetByVersion,
  ): Promise<ProjectSnapshotRes.GetByVersion>

  abstract getPayload(
    cmd: ProjectSnapshotReqCmd.GetPayload,
  ): Promise<ProjectSnapshotRes.GetPayload>

  abstract getStatus(
    cmd: ProjectSnapshotReqCmd.GetStatus,
  ): Promise<ProjectSnapshotRes.GetStatus>

  abstract create(
    cmd: ProjectSnapshotReqCmd.Create,
  ): Promise<ProjectSnapshotRes.Create>
}
