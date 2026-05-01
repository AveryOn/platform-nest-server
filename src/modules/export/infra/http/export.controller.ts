import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import { SessionGuard } from '~/modules/auth/infra/session.guard'
import {
  EXPORT_SERVICE_PORT,
  type ExportServicePort,
} from '~/modules/export/ports/export.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Export)
@Controller({
  path: 'projects',
  version: '1',
})
export class ExportController {
  constructor(
    @Inject(EXPORT_SERVICE_PORT)
    private readonly exportService: ExportServicePort,
  ) {}

  // ---------------------------------------------------
  // [POST] | EXPORT RESOLVED RULESET
  // #region POST---------------------------------------
  @Post(':projectId/export')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '',
    description: '',
    operationId: 'export_resolved_ruleset',
    tags: [ApiSwaggerTag.Export],
  })
  @ApiBody({
    type: Object,
    description: '',
  })
  @ApiDataResponse({
    type: Object,
    status: HttpStatus.CREATED,
    description: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: '',
  })
  async createProject(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Body()
    body: null,

    @Req()
    req: Request,
  ): Promise<object> {
    return await this.exportService.export({
      organizationId: (req as any).activeOrganizationId,
    })
  }
}
