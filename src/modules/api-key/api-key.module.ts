import { Module } from '@nestjs/common'
import { ApiKeyService } from '~/modules/api-key/application/api-key.service'
import { ApiKeyAuthGuard } from '~/modules/api-key/infra/auth/api-key-auth.guard'
import { SessionOrApiKeyGuard } from '~/modules/api-key/infra/auth/api-key.guard'
import { ApiKeyController } from '~/modules/api-key/infra/http/api-key.controller'
import { ApiKeyDrizzleRepo } from '~/modules/api-key/infra/persistence/drizzle.api-key.repo'
import { API_KEY_REPO_PORT } from '~/modules/api-key/ports/api-key.repo.port'
import { API_KEY_SERVICE_PORT } from '~/modules/api-key/ports/api-key.service.port'
import { AuthModule } from '~/modules/auth/auth.module'
import { BrandModule } from '~/modules/brand/brand.module'
import { ProjectModule } from '~/modules/project/project.module'

@Module({
  controllers: [ApiKeyController],
  imports: [AuthModule, BrandModule, ProjectModule],
  providers: [
    ApiKeyAuthGuard,
    SessionOrApiKeyGuard,
    {
      provide: API_KEY_SERVICE_PORT,
      useClass: ApiKeyService,
    },
    {
      provide: API_KEY_REPO_PORT,
      useClass: ApiKeyDrizzleRepo,
    },
  ],
  exports: [API_KEY_SERVICE_PORT],
})
export class ApiKeyModule {}
