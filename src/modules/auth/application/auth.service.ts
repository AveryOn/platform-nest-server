import { Injectable } from '@nestjs/common'

import type { SessionContext } from '~/modules/auth/application/auth.types'
import { auth } from '~/modules/auth/infra/better-auth.instance'
import type { AuthServicePort } from '~/modules/auth/ports/auth.service.port'

@Injectable()
export class BetterAuthService implements AuthServicePort {
  async getSession(headers: Headers): Promise<SessionContext> {
    const result = await auth.api.getSession({
      headers,
    })

    return {
      session: result?.session ?? null,
      user: result?.user ?? null,
    }
  }
}
