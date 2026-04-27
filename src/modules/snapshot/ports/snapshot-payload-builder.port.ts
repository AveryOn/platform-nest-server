import type {
  SnapshotPayload,
  SnapshotPayloadBuilderCmd,
} from '~/modules/snapshot/application/snapshot.type'

export const SNAPSHOT_PAYLOAD_BUILDER_PORT = Symbol(
  'SNAPSHOT_PAYLOAD_BUILDER_PORT',
)

export abstract class SnapshotPayloadBuilderPort {
  abstract build(
    cmd: SnapshotPayloadBuilderCmd.Build,
  ): Promise<SnapshotPayload>
}
