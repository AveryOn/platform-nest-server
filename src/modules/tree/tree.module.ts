import { Module } from '@nestjs/common'
import { TREE_PORT } from '~/modules/tree/ports/tree.service.port'
import { TreeController } from '~/modules/tree/infra/http/tree.controller'
import { TREE_REPO_PORT } from '~/modules/tree/ports/tree.repo.port'
import { TreeDrizzleRepo } from '~/modules/tree/infra/persistance/tree.drizzle.repo'
import { TreeService } from '~/modules/tree/application/tree.service'

@Module({
  controllers: [TreeController],
  providers: [
    {
      provide: TREE_PORT,
      useClass: TreeService,
    },
    {
      provide: TREE_REPO_PORT,
      useClass: TreeDrizzleRepo,
    },
  ],
  exports: [TREE_PORT],
})
export class TreeModule {}
