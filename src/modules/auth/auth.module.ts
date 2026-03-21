import { Global, Module } from '@nestjs/common'
import { AuthService } from '~/modules/auth/auth.service'
import { AuthController } from '~/modules/auth/infra/http/auth.controller'

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
