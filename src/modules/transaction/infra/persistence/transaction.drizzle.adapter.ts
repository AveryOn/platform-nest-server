import { Inject, Injectable } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import type { Tx } from '~/infra/drizzle/drizzle.type'
import type { TransactionServicePort } from '~/modules/transaction/ports/transaction.service.port'

/**
 * Drizzle-based implementation of the TransactionServicePort.
 *
 * Acts as an adapter between the application layer and the Drizzle ORM
 * transaction API. It encapsulates the underlying database transaction
 * mechanism and exposes a generic `run` method that executes a given
 * handler function within a transaction boundary.
 *
 * This allows the application layer to remain decoupled from Drizzle
 * and interact only through the abstract TransactionServicePort.
 *
 * @template Tx - The transaction type provided by Drizzle ORM.
 */
@Injectable()
export class DrizzleTxAdapter implements TransactionServicePort<Tx> {
  constructor(
    @Inject(DrizzleService)
    private readonly drizzle: DrizzleService,
  ) {}

  run(handler: (tx: Tx) => Promise<Tx>): Promise<Tx> {
    return this.drizzle.db.transaction(handler)
  }
}
