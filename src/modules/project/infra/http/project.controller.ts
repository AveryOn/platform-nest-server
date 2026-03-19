import { Controller, Get, Inject } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { ApiSwaggerTag } from "~/shared/const/app.const"
import { PROJECT_PORT, type ProjectServicePort } from "~/modules/project/ports/project.service.port"


@ApiTags(ApiSwaggerTag.Project)
@Controller({ path: 'projects', version: '1' })
export class ProjectController {
  constructor(
    @Inject(PROJECT_PORT)
    private projectService: ProjectServicePort,
  ) {}

    @Get('')
    async ping() {
        return { msg: 'ok' }
    }
}
