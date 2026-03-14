import { Module } from '@nestjs/common'
import { AuthController } from '~/modules/auth/infra/http/auth.controller'
import { PrismaAuthRepository } from '~/modules/auth/infra/persistence/prisma.repository'
import { AuthRepository } from '~/modules/auth/auth.repository'
import { UserModule } from '~/modules/user/user.module'
import { AUTH_PORT } from '~/modules/auth/auth.port'
import { AuthService } from '~/modules/auth/auth.service'

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_PORT,
      useClass: AuthService,
    },
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
})
export class AuthModule {}
