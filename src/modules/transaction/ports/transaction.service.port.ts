import type { TransactionContext } from '~/modules/transaction/application/transaction.type'

/**
 * Injection token used to register and resolve the transaction service
 * implementation within the DI container.
 *
 * Typically bound to an infrastructure-specific adapter (e.g. Drizzle, Prisma).
 */
export const TX_PORT = Symbol('TX_PORT')

/**
 * Abstract contract for managing database transactions at the application level.
 *
 * Defines a generic interface for executing a unit of work within a transactional
 * boundary, without exposing any infrastructure-specific details.
 *
 * This port enables application services to orchestrate transactional workflows
 * while remaining decoupled from the underlying database or ORM implementation.
 *
 * @template TTx - Opaque transaction context passed through repositories.
 *                Its concrete type is defined in the infrastructure layer.
 */
export abstract class TransactionServicePort<
  TTx extends TransactionContext,
> {
  /**
   * Executes the given handler function within a transaction.
   *
   * The handler receives a transaction context object, which should be passed
   * to repository methods to ensure all operations participate in the same
   * transaction.
   *
   * Implementations are responsible for:
   * - starting the transaction
   * - committing on success
   * - rolling back on error
   *
   * @param handler - Async function representing a unit of work.
   * @returns A promise resolving with the handler result.
   */
  abstract run(handler: (tx: TTx) => Promise<TTx>): Promise<TTx>
}
