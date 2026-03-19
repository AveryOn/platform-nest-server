import { DATE_KEY } from '~/shared/utils/datetime'

export const REDIS_PORT = Symbol('REDIS_PORT')

export interface RedisServicePort {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: DATE_KEY): Promise<void>
}
