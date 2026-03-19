import { Controller, Get, Inject } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { ApiSwaggerTag } from "~/shared/const/app.const"
import { EXPORT_PORT, type ExportServicePort } from "~/modules/export/ports/export.service.port"


@ApiTags(ApiSwaggerTag.Export)
@Controller({ path: 'exports', version: '1' })
export class ExportController {
  constructor(
    @Inject(EXPORT_PORT)
    private exportService: ExportServicePort,
  ) {}

    @Get('')
    async ping() {
        return { msg: 'ok' }
    }
}