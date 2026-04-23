import {
  text,
  timestamp,
  uuid,
  varchar,
  type PgColumn,
  type PgTableWithColumns,
  type UpdateDeleteAction,
} from 'drizzle-orm/pg-core'
import type { Database, Tx } from '~/infra/drizzle/drizzle.type'

// --------------------------------------------------------
// |    CREATION A SCHEMA
// --------------------------------------------------------
export const id = () => uuid('id').defaultRandom().primaryKey()
export const createdAt = () =>
  timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull()
export const updatedAt = () =>
  timestamp('updated_at', {
    withTimezone: true,
  }).$onUpdate(() => new Date())
export const deletedAt = () =>
  timestamp('deleted_at', {
    withTimezone: true,
  })
export const varchar64 = (field: string) =>
  varchar(field, {
    length: 64,
  })
export const varchar255 = (field: string) =>
  varchar(field, {
    length: 255,
  })
export const name = () => varchar255('name').notNull()
export const description = () => text('description')

export const referenceOnUUID = <T extends PgTableWithColumns<any>>(
  field: string,
  table: () => T,
  onField?: PgColumn,
  config?: {
    onUpdate?: UpdateDeleteAction
    onDelete?: UpdateDeleteAction
  },
) =>
  uuid(field).references(
    () => (onField ? onField : table()['id']),
    config,
  )
export const referenceOnText = <T extends PgTableWithColumns<any>>(
  field: string,
  table: () => T,
  onField?: PgColumn,
  config?: {
    onUpdate?: UpdateDeleteAction
    onDelete?: UpdateDeleteAction
  },
) =>
  text(field).references(
    () => (onField ? onField : table()['id']),
    config,
  )

// --------------------------------------------------------
// |    OTHER HELPERS
// --------------------------------------------------------

/**
 * Returns the active database connection.
 *
 * If a transaction `tx` is provided, it will be used.
 * Otherwise, the base `db` instance is returned.
 *
 * Useful for writing functions that can operate
 * both inside and outside of a transaction.
 *
 * @param db base database instance
 * @param tx optional transaction
 * @returns transaction or base database instance
 */
export function defineDb(db: Database, tx: Tx): Tx
export function defineDb(db: Database, tx: undefined): Database
export function defineDb(db: Database, tx?: Tx): Database | Tx
export function defineDb(db: Database, tx?: Tx) {
  return tx ?? db
}
