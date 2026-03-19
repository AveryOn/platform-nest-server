import { Controller, Get, Inject } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { ApiSwaggerTag } from "~/shared/const/app.const"
import { TEMPLATE_PORT, type TemplateServicePort } from "~/modules/template/ports/template.service.port"


@ApiTags(ApiSwaggerTag.Template)
@Controller({ path: 'templates', version: '1' })
export class TemplateController {
  constructor(
    @Inject(TEMPLATE_PORT)
    private templateService: TemplateServicePort,
  ) {}

    @Get('')
    async ping() {
        return { msg: 'ok' }
    }
}