import { SetMetadata } from '@nestjs/common'
import type { ApiKeyScope } from '~/modules/api-key/application/api-key.type'

export const API_KEY_SCOPES_META = 'api_key_scopes'

export const ApiKeyScopes = (...scopes: ApiKeyScope[]) =>
  SetMetadata(API_KEY_SCOPES_META, scopes)
