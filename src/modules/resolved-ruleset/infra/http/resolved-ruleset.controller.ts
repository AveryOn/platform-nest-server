import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import {
  GetResolvedRulesetDto,
  GetResolvedRulesetResponse,
} from '~/modules/resolved-ruleset/infra/http/resolved-ruleset.dto'
import {
  RESOLVED_RULESET_SERVICE_PORT,
  type ResolvedRulesetServicePort,
} from '~/modules/resolved-ruleset/ports/resolved-ruleset.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.ResolvedRuleset)
@Controller({
  path: 'projects',
  version: '1',
})
export class ResolvedRulesetController {
  constructor(
    @Inject(RESOLVED_RULESET_SERVICE_PORT)
    private readonly resolvedRulesetService: ResolvedRulesetServicePort,
  ) {}
  @Get(':projectId/resolved-ruleset')
  @ApiOperation({
    summary: 'Get resolved ruleset',
    description:
      'Returns the final resolved flat ruleset for the specified project with applied ordering and filtering rules',
    operationId: 'get_resolved_ruleset',
    tags: [ApiSwaggerTag.ResolvedRuleset],
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    description: 'Project UUID',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Resolved ruleset successfully returned',
    type: GetResolvedRulesetResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or query parameters',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to this project',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async getResolvedRuleset(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Query()
    query: GetResolvedRulesetDto,
  ): Promise<GetResolvedRulesetResponse> {
    return await this.resolvedRulesetService.getResolvedRuleset({
      projectId: projectId,
      includeMetadata: query.includeMetadata,
    })
  }
}
