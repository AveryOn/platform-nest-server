import { Module } from '@nestjs/common'
import { TX_PORT } from '~/modules/transaction/ports/transaction.service.port'
import { DrizzleTxAdapter } from './infra/persistence/transaction.drizzle.adapter'

/**
 * TransactionModule
 *
 * Provides a unified transaction boundary abstraction for the application layer.
 *
 * Purpose:
 * - Decouple application services from конкретной ORM / DB implementaion
 * - Centralize transaction management via a single injectable port (TX_PORT)
 * - Allow services to orchestrate multi-repository operations within a single transaction
 *
 * How it works:
 * - Binds the abstract TransactionServicePort (via TX_PORT token)
 *   to a concrete infrastructure adapter (DrizzleTxAdapter)
 * - Any application service can inject TX_PORT and execute logic inside `run(...)`
 * - The actual transaction implementation is delegated to the adapter
 *
 * Architectural role:
 * - Part of the infrastructure layer (adapter wiring)
 * - Exposes only the port (TX_PORT) to the rest of the system
 * - Keeps application layer compliant with hexagonal architecture principles
 *
 * Benefits:
 * - Swappable transaction implementation (Drizzle > Prisma > raw SQL, etc.)
 * - Consistent transaction API across the codebase
 * - No direct dependency on DrizzleService inside application services
 *
 * Usage:
 * ```ts
 * constructor(@Inject(TX_PORT) private readonly tx: TransactionServicePort) {}
 *
 * await this.tx.run(async (tx) => {
 *   await repoA.doSomething(tx)
 *   await repoB.doSomething(tx)
 * })
 * ```
 */
@Module({
  providers: [
    {
      provide: TX_PORT,
      useClass: DrizzleTxAdapter,
    },
  ],
  exports: [TX_PORT],
})
export class TransactionModule {}
