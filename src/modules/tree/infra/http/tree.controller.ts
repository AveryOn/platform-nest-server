import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { TREE_PORT, type TreeServicePort } from '~/modules/tree/ports/tree.service.port'

@ApiTags(ApiSwaggerTag.Tree)
@Controller({ path: 'trees', version: '1' })
export class TreeController {
  constructor(
    @Inject(TREE_PORT)
    private treeService: TreeServicePort,
  ) {}
}
