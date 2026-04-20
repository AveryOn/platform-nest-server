import { Controller, Get, HttpStatus, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import {
  ResolvedRuleItemResponseDto,
  ResolvedRulesetQueryDto,
  ResolvedRulesetResponseDto,
} from './resolved-ruleset.dto'

@ApiTags(ApiSwaggerTag.ResolvedRuleset)
@Controller({ path: 'projects', version: '1' })
export class ResolvedRulesetController {
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resolved ruleset successfully returned',
    type: ResolvedRulesetResponseDto,
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
  getResolvedRuleset(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: ResolvedRulesetQueryDto,
  ): ResolvedRulesetResponseDto {
    const rule: ResolvedRuleItemResponseDto = {
      id: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
      projectId,
      ruleGroupId: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
      title: 'When to use',
      body: 'Use button for primary actions.',
      metadata: query.includeMetadata === false ? null : { tags: ['button', 'usage'] },
      path: ['Components', 'Button', 'When to use'],
      orderKey: '0001.0001.0001',
      orderIndex: 0,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
    }

    return {
      projectId,
      total: 1,
      includeMetadata: query.includeMetadata ?? true,
      rules: [rule],
    }
  }
}
