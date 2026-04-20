import { Controller, Get, HttpStatus, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  ProjectTreeNodeResponseDto,
  ProjectTreeQueryDto,
  ProjectTreeResponseDto,
  RuleTreeItemResponseDto,
} from '~/modules/tree/infra/http/tree.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Tree)
@Controller({ path: 'projects', version: '1' })
export class TreeController {
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project tree successfully returned',
    type: ProjectTreeResponseDto,
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
  getProjectTree(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: ProjectTreeQueryDto,
  ): ProjectTreeResponseDto {
    const rule: RuleTreeItemResponseDto = {
      id: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
      ruleGroupId: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
      title: 'When to use',
      body: 'Use button for primary actions.',
      metadata: { tags: ['button', 'usage'] },
      orderIndex: 0,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
    }

    const childNode: ProjectTreeNodeResponseDto = {
      id: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
      projectId,
      parentGroupId: '7c917903-d8f3-445b-bec8-122c4cf3a411',
      name: 'Button',
      description: 'Rules for button component',
      kind: 'component',
      orderIndex: 0,
      isHidden: false,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
      rules: [rule],
      children: [],
    }

    const rootNode: ProjectTreeNodeResponseDto = {
      id: '7c917903-d8f3-445b-bec8-122c4cf3a411',
      projectId,
      parentGroupId: null,
      name: 'Components',
      description: 'Component rules',
      kind: 'category',
      orderIndex: 0,
      isHidden: false,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
      rules: [],
      children: [childNode],
    }

    return {
      projectId,
      includeHidden: query.includeHidden ?? true,
      tree: [rootNode],
    }
  }
}
