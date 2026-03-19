import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import {
  TEMPLATE_SNAPSHOT_PORT,
  type TemplateSnapshotServicePort,
} from '~/modules/template-snapshot/ports/template-snapshot.service.port'

@ApiTags(ApiSwaggerTag.TemplateSnapshot)
@Controller({ path: 'template-snapshots', version: '1' })
export class TemplateSnapshotController {
  constructor(
    @Inject(TEMPLATE_SNAPSHOT_PORT)
    private templateSnapshotService: TemplateSnapshotServicePort,
  ) {}

  @Get('')
  async ping() {
    return { msg: 'ok' }
  }
}
