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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import { ApiKeyScope } from '~/modules/api-key/application/api-key.type'
import { ApiKeyScopes } from '~/modules/api-key/infra/auth/api-key-scopes.decorator'
import { SessionOrApiKeyGuard } from '~/modules/api-key/infra/auth/api-key.guard'
import {
  ExportProjectReq,
  ExportProjectRes,
} from '~/modules/export/infra/http/export.dto'
import {
  EXPORT_SERVICE_PORT,
  type ExportServicePort,
} from '~/modules/export/ports/export.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

type AuthRequest = Request & {
  activeOrganizationId: string
}

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
  // [POST] | EXPORT PROJECT RULESET
  // #region POST---------------------------------------
  @Post(':projectId/export')
  @UseGuards(SessionOrApiKeyGuard)
  @ApiKeyScopes(ApiKeyScope.ExportRead)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Export project ruleset',
    description:
      'Builds the resolved ruleset for the specified project and returns it in the requested export format. The endpoint can optionally create an immutable snapshot before returning the export result.',
    operationId: 'export_project_ruleset',
    tags: [ApiSwaggerTag.Export],
  })
  @ApiBody({
    type: ExportProjectReq,
    description: 'Export format and snapshot creation options.',
  })
  @ApiDataResponse({
    type: ExportProjectRes,
    status: HttpStatus.CREATED,
    description: 'Project ruleset has been exported successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid project id or invalid request body.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication is required.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have access to the requested project.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description:
      'Export request is valid, but the ruleset cannot be exported.',
  })
  async exportProjectRuleset(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Body()
    body: ExportProjectReq,

    @Req()
    req: AuthRequest,
  ): Promise<ExportProjectRes> {
    if (!req.activeOrganizationId) {
      throw new UnauthorizedException('Missing organization context')
    }
    return await this.exportService.export({
      projectId,
      organizationId: req.activeOrganizationId,
      format: body.format,
      createSnapshot: body.createSnapshot,
    })
  }
}
