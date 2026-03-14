import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { RedisServicePort } from '~/infra/redis/ports/redis.service.port'
import { isObject } from '~/shared/utils/object'
import { AppError, ERROR } from '~/core/error/app-error'
import { AppLoggerService } from '~/core/logger/logger.service'
import { computeAppendTime, DATE_KEY } from '~/shared/utils/datetime'

@Injectable()
export class RedisService implements RedisServicePort {
  constructor(
    private readonly logger: AppLoggerService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async set<T>(
    key: string, 
    value: T, 
    /** TTL in milliseconds */
    ttl?: DATE_KEY,
  ) {
    const ms = computeAppendTime(ttl ? ttl : '1h')
    this.logger.info('LALA', { context: { ms } })
    if(isObject(value) || Array.isArray(value)) {
      try {
        const args = [key, JSON.stringify(value), 'PX', ms!] as const
        return void await this.redis.set(...args)
      } 
      // An error may occur due to a circular reference in the object
      catch (err) {
        throw new AppError(ERROR.INVALID_DATA, this.logger).log('', { scope: 'RedisSetValue', context: { err } })  
      }
    }
    return void await this.redis.set(key, String(value), 'PX', ms!)
  }

  async get<T>(key: string): Promise<T | null> {
    const response = await this.redis.get(key)

    if(!response) return null
    // Attempt to parse and obtain an object
    try {
      return JSON.parse(response)
    } 
    catch {/* If an error occurs, then this is not an object */}

    // If the received value is not NaN, then it is a valid number
    if(!Object.is(+response, Number.NaN)) {
      return +response as T
    }

    let formatted = response.toLowerCase()
    if(['false', 'true'].includes(formatted)) {
      return formatted as T
    }
    return response as T
  }
}