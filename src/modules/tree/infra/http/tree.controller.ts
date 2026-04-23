import { Controller, Get, HttpStatus, Inject, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProjectTreeDto, ProjectTreeResponse } from '~/modules/tree/infra/http/tree.dto'
import { TREE_SERVICE_PORT, type TreeServicePort } from '~/modules/tree/ports/tree.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Tree)
@Controller({ path: 'projects', version: '1' })
export class TreeController {
  constructor(
    @Inject(TREE_SERVICE_PORT)
    private readonly treeService: TreeServicePort,
  ) {}

  @Get(':projectId/tree')
  @ApiOperation({
    summary: 'Get project editor tree',
    description:
      'Returns the assembled editor tree for the specified project, including nested rule groups and direct rules',
    operationId: 'get_project_tree',
    tags: [ApiSwaggerTag.Tree],
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    description: 'Project UUID',
  })
  @ApiQuery({
    name: 'includeHidden',
    required: false,
    type: Boolean,
    example: false,
    description: 'Include hidden rule groups and rules in the tree',
  })
  @ApiQuery({
    name: 'includeMetadata',
    required: false,
    type: Boolean,
    example: true,
    description: 'Include metadata field in rule groups and rules',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project tree successfully returned',
    type: ProjectTreeResponse,
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
  async getProjectTree(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: ProjectTreeDto,
  ): Promise<ProjectTreeResponse> {
    return await this.treeService.getEditorTree({
      projectId: projectId,
      includeHidden: query.includeHidden,
      includeMetadata: query.includeMetadata,
    })
  }
}
