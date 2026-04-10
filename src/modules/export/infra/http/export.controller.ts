import { Controller, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EXPORT_PORT, type ExportServicePort } from '~/modules/export/ports/export.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Export)
@Controller({ path: 'exports', version: '1' })
export class ExportController {
  constructor(
    @Inject(EXPORT_PORT)
    private exportService: ExportServicePort,
  ) {}
}
