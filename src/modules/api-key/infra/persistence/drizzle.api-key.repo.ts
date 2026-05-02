import { Injectable } from '@nestjs/common'
import type { ApiKeyRepoPort } from '~/modules/api-key/ports/api-key.repo.port'

@Injectable()
export class ApiKeyDrizzleRepo implements ApiKeyRepoPort {}
