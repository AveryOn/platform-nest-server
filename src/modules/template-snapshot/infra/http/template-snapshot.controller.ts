import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  TEMPLATE_SNAPSHOT_PORT,
  type TemplateSnapshotServicePort,
} from '~/modules/template-snapshot/ports/template-snapshot.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.TemplateSnapshot)
@Controller({ path: 'template-snapshots', version: '1' })
export class TemplateSnapshotController {
  constructor(
    @Inject(TEMPLATE_SNAPSHOT_PORT)
    private templateSnapshotService: TemplateSnapshotServicePort,
  ) {}

  @Get('')
  ping() {
    return { msg: 'ok' }
  }
}
