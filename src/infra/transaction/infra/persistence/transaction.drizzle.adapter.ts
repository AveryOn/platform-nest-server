import { Inject, Injectable } from '@nestjs/common'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import type { TransactionPort } from '~/infra/transaction/ports/transaction.port'

/**
 * Drizzle-based implementation of the TransactionPort.
 *
 * Acts as an adapter between the application layer and the Drizzle ORM
 * transaction API. It encapsulates the underlying database transaction
 * mechanism and exposes a generic `run` method that executes a given
 * handler function within a transaction boundary.
 *
 * This allows the application layer to remain decoupled from Drizzle
 * and interact only through the abstract TransactionPort.
 *
 * @template Tx - The transaction type provided by Drizzle ORM.
 */
@Injectable()
export class DrizzleTxAdapter implements TransactionPort<Tx> {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,
  ) {}

  run<TResult>(handler: (tx: Tx) => Promise<TResult>): Promise<TResult> {
    return this.drizzle.db.transaction(handler)
  }
}
