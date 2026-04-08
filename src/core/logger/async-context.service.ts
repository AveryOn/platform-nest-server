import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'node:async_hooks'
import { ALSKey, AsyncLocalStorageType } from './logger.types'

@Injectable()
export class AsyncContextService {
  private readonly als = new AsyncLocalStorage<AsyncLocalStorageType>()

  readonly ALSKey = ALSKey

  run(store: AsyncLocalStorageType, callback: () => void) {
    this.als.run(store, callback)
  }

  getStore(): AsyncLocalStorageType | undefined {
    return this.als.getStore()
  }

  getValue<K extends ALSKey>(field: K): AsyncLocalStorageType[K] | undefined {
    return this.getStore()?.[field]
  }

  setValue<K extends ALSKey, V extends AsyncLocalStorageType[K]>(field: K, value: V): void {
    const store = this.getStore()
    if (store) store[field] = value
  }
}
