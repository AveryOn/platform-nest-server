import { Injectable } from '@nestjs/common'
import type { SnapshotRepoPort } from '~/modules/snapshot/ports/snapshot.repo.port'

@Injectable()
export class SnapashotDrizzleRepo implements SnapshotRepoPort {}
