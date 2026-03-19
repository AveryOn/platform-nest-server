import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from '~/modules/auth/auth.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import {
  SignInDto,
  SignInResponse,
  SignInSocialDto,
  SignInSocialResponse,
  SignUpDto,
  SignUpResponse,
} from '~/modules/auth/infra/http/auth.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@Controller({ path: 'auth', version: '1' })
@ApiTags(ApiSwaggerTag.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('test')
  test() {
    return { ok: true }
  }

  @Post('sign-up')
  @ApiOperation({
    summary: 'Sign-Up',
    description: 'This is fully description',
    operationId: 'auth_sign_up',
  })
  @ApiDataResponse({
    type: SignUpResponse,
    status: 201,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.auth.api.signUpEmail({
      body: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    })
  }

  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign-In',
    description: 'This is fully description',
    operationId: 'auth_sign_in',
  })
  @ApiDataResponse({
    type: SignInResponse,
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async signIn(@Body() body: SignInDto) {
    return await this.authService.auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
    })
  }

  @Post('sign-in/social')
  @ApiOperation({
    summary: 'Social Sign-In',
    description: 'This is fully description',
    operationId: 'auth_sign_in_social',
  })
  @ApiDataResponse({
    type: SignInSocialResponse,
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async signInSocial(@Body() body: SignInSocialDto) {
    return await this.authService.auth.api.signInSocial({
      body: {
        provider: body.provider,
        callbackURL: body.callbackURL,
      },
    })
  }

  @Post('sign-out')
  @ApiOperation({
    summary: 'Sign-Out',
    description: 'This is fully description',
    operationId: 'auth_sign_out',
  })
  @ApiDataResponse({
    type: Object,
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async signOut() {
    try {
      return await this.authService.auth.api.signOut()
    } catch (err) {
      console.log(err)
      throw 'asd'
    }
  }
}
