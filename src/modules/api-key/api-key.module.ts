import { Module } from '@nestjs/common'
import { ApiKeyController } from '~/modules/api-key/infra/http/api-key.controller'
import { AuthModule } from '~/modules/auth/auth.module'

@Module({
  controllers: [ApiKeyController],
  imports: [AuthModule],
  providers: [],
  exports: [],
})
export class ApiKeyModule {}
