import { Controller, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { TREE_PORT, type TreeServicePort } from '~/modules/tree/ports/tree.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Tree)
@Controller({ path: 'trees', version: '1' })
export class TreeController {
  constructor(
    @Inject(TREE_PORT)
    private treeService: TreeServicePort,
  ) {}
}
