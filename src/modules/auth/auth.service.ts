import { Inject, Injectable } from '@nestjs/common'
import type { AuthPort } from '~/modules/auth/auth.port'
import { AuthRepository } from '~/modules/auth/auth.repository'
import { USER_PORT, type UserServicePort } from '~/modules/user/ports/user.service.port'

@Injectable()
export class AuthService implements AuthPort {
  constructor(
    private readonly auth: AuthRepository,
    @Inject(USER_PORT)
    private readonly users: UserServicePort,
  ) {}

  // empty for now
  /**
   * LALALA
   * @param email
   * @returns
   */
  async login(email: string) {
    await this.auth.create(email)
    this.users.getUsers({ limit: 10, page: 1 })
    return { ok: true, email }
  }
}
