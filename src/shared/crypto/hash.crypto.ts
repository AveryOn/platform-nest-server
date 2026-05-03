import { createId as cuid2CreateId } from '@paralleldrive/cuid2'
import { createHash } from 'node:crypto'

export function createId(): string {
  return cuid2CreateId()
}

type JsonLike =
  | null
  | string
  | number
  | boolean
  | JsonLike[]
  | { [key: string]: JsonLike }

/**
 * Builds a deterministic SHA-256 hash for snapshot payloads.
 *
 * Object keys are sorted recursively before serialization,
 * so semantically identical payloads produce the same hash
 * even if object key insertion order differs.
 */
export function buildSnapshotHash(payload: unknown): string {
  return createHash('sha256')
    .update(stableStringify(payload))
    .digest('hex')
}

function stableStringify(value: unknown): string {
  return JSON.stringify(normalizeForHash(value))
}

function normalizeForHash(value: unknown): JsonLike {
  if (value === null) {
    return null
  }

  if (Array.isArray(value)) {
    return value.map(normalizeForHash)
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const sorted: Record<string, JsonLike> = {}

    for (const key of Object.keys(record).sort()) {
      const item = record[key]

      if (typeof item === 'undefined') {
        continue
      }

      if (typeof item === 'function' || typeof item === 'symbol') {
        continue
      }

      sorted[key] = normalizeForHash(item)
    }

    return sorted
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  return null
}
