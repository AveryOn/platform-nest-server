import { Module } from '@nestjs/common'
import { UserController } from '~/modules/user/infra/http/user.controller'
import { USER_PORT } from '~/modules/user/ports/user.service.port'
import { USER_REPOSITORY_PORT } from '~/modules/user/ports/user.repository.port'
import { UserService } from '~/modules/user/application/user.service'
import { UserDrizzleRepository } from '~/modules/user/infra/persistance/user.drizzle.repository'

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_PORT,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserDrizzleRepository,
    },
  ],
  exports: [USER_PORT],
})
export class UserModule {}
