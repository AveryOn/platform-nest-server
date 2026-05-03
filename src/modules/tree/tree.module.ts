import { Module } from '@nestjs/common'
import { ApiKeyModule } from '~/modules/api-key/api-key.module'
import { AuthModule } from '~/modules/auth/auth.module'
import { BrandModule } from '~/modules/brand/brand.module'
import { ProjectModule } from '~/modules/project/project.module'
import { TreeService } from '~/modules/tree/application/tree.service'
import { TreeController } from '~/modules/tree/infra/http/tree.controller'
import { TreeDrizzleRepo } from '~/modules/tree/infra/persistence/tree.drizzle.repo'
import { TREE_REPO_PORT } from '~/modules/tree/ports/tree.repo.port'
import { TREE_SERVICE_PORT } from '~/modules/tree/ports/tree.service.port'

@Module({
  controllers: [TreeController],
  imports: [ProjectModule, BrandModule, AuthModule, ApiKeyModule],
  providers: [
    {
      provide: TREE_REPO_PORT,
      useClass: TreeDrizzleRepo,
    },
    {
      provide: TREE_SERVICE_PORT,
      useClass: TreeService,
    },
  ],
  exports: [TREE_SERVICE_PORT],
})
export class TreeModule {}
