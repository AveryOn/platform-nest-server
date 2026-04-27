import { createId as cuid2CreateId } from '@paralleldrive/cuid2'
import { createHash } from 'node:crypto'

export function createId(): string {
  return cuid2CreateId()
}

export function buildSnapshotHash(payload: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')
}
