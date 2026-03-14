import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Inject,
  Get,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '~/modules/auth/auth.service'
import { AUTH_PORT } from '~/modules/auth/auth.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@Controller({ path: 'auth', version: '1' })
@ApiTags(ApiSwaggerTag.Auth)
export class AuthController {
  constructor(
    @Inject(AUTH_PORT)
    private authService: AuthService,
  ) {}

  @Get()
  async ping() {
    return { msg: 'Auth controller is running' }
  }

  @Post('login')
  async loginUser(@Body('email') email: string) {
    try {
      return await this.authService.login(email)
    } catch (e) {
      if (e instanceof Error) throw new UnauthorizedException()
      throw e
    }
  }
}
