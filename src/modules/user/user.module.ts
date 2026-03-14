import { Module } from '@nestjs/common'
import { UserController } from '~/modules/user/infra/http/user.controller'
import { USER_PORT } from '~/modules/user/ports/user.service.port'
import { USER_REPOSITORY_PORT } from '~/modules/user/ports/user.repository.port'
import { UserService } from '~/modules/user/application/user.service'
import { UserPrismaRepository } from '~/modules/user/infra/persistance/user.prisma.repository'

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_PORT,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [USER_PORT],
})
export class UserModule {}
