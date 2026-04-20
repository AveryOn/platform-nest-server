import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  RuleGroupCreateDto,
  RuleGroupItemResponseDto,
  RuleGroupMoveDto,
  RuleGroupPatchDto,
  RuleGroupRemoveResponseDto,
  RuleGroupReorderChildrenDto,
  RuleGroupReorderRootDto,
  RuleGroupType,
  RuleGroupUpdateResponseDto,
} from '~/modules/rule-group/infra/http/rule-group.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.RuleGroup)
@Controller({ version: '1' })
export class RuleGroupController {
  @Post('projects/:projectId/rule-groups')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create rule group',
    description: 'Creates a new rule group inside the specified project',
    operationId: 'create_rule_group',
    tags: [ApiSwaggerTag.RuleGroup],
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    description: 'Project UUID',
  })
  @ApiBody({
    type: RuleGroupCreateDto,
    description: 'Payload for creating a rule group',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Rule group successfully created',
    type: RuleGroupItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or request body',
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
    description: 'Project or parent rule group not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Invalid hierarchy or ordering conflict',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  createRuleGroup(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: RuleGroupCreateDto,
  ): RuleGroupItemResponseDto {
    return {
      id: crypto.randomUUID(),
      projectId,
      parentGroupId: body.parentGroupId ?? null,
      name: body.name,
      description: body.description ?? null,
      type: body.type || (RuleGroupType as any).section,
      orderIndex: body.orderIndex,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  @Get('rule-groups/:groupId')
  @ApiOperation({
    summary: 'Get rule group by id',
    description: 'Returns rule group details by UUID',
    operationId: 'get_rule_group_by_id',
    tags: [ApiSwaggerTag.RuleGroup],
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully returned',
    type: RuleGroupItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to this rule group',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule group not found',
  })
  getRuleGroupById(@Param('groupId', ParseUUIDPipe) groupId: string): RuleGroupItemResponseDto {
    return {
      id: groupId,
      projectId: '550e8400-e29b-41d4-a716-446655440000',
      parentGroupId: null,
      name: 'Button',
      description: 'Rules for button component',
      type: RuleGroupType.component,
      orderIndex: 1,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
    }
  }

  @Patch('rule-groups/:groupId')
  @ApiOperation({
    summary: 'Update rule group',
    description: 'Updates mutable fields of a rule group',
    operationId: 'patch_rule_group',
    tags: [ApiSwaggerTag.RuleGroup],
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiBody({
    type: RuleGroupPatchDto,
    description: 'Payload for updating rule group fields',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully updated',
    type: RuleGroupUpdateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or request body',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to this rule group',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule group not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Update violates hierarchy constraints',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  patchRuleGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() _body: RuleGroupPatchDto,
  ): RuleGroupUpdateResponseDto {
    return {
      status: 'success',
      groupId,
    }
  }

  @Post('rule-groups/:groupId/move')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Move rule group',
    description: 'Moves a rule group to another parent and/or position',
    operationId: 'move_rule_group',
    tags: [ApiSwaggerTag.RuleGroup],
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiBody({
    type: RuleGroupMoveDto,
    description: 'Payload for moving a rule group',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully moved',
    type: RuleGroupUpdateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or request body',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to this rule group',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule group or target parent group not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Invalid move operation or cross-project move detected',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  moveRuleGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() _body: RuleGroupMoveDto,
  ): RuleGroupUpdateResponseDto {
    return {
      status: 'success',
      groupId,
    }
  }

  @Post('rule-groups/:groupId/reorder-children')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reorder child rule groups',
    description: 'Reorders direct child rule groups of the specified parent group',
    operationId: 'reorder_rule_group_children',
    tags: [ApiSwaggerTag.RuleGroup],
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    type: String,
    format: 'uuid',
    description: 'Parent rule group UUID',
  })
  @ApiBody({
    type: RuleGroupReorderChildrenDto,
    description: 'Payload for reordering child rule groups',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Child rule groups successfully reordered',
    type: RuleGroupUpdateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or request body',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to this rule group',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule group or one of child groups not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Reorder input contains invalid hierarchy or duplicate ids',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  reorderChildren(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() _body: RuleGroupReorderChildrenDto,
  ): RuleGroupUpdateResponseDto {
    return {
      status: 'success',
      groupId,
    }
  }

  @Post('projects/:projectId/rule-groups/reorder-root')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reorder root rule groups',
    description: 'Reorders root rule groups inside the specified project',
    operationId: 'reorder_root_rule_groups',
    tags: [ApiSwaggerTag.RuleGroup],
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    description: 'Project UUID',
  })
  @ApiBody({
    type: RuleGroupReorderRootDto,
    description: 'Payload for reordering root rule groups',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Root rule groups successfully reordered',
    type: RuleGroupUpdateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or request body',
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
    description: 'Project or one of root groups not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Reorder input contains non-root groups or duplicate ids',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  reorderRootGroups(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: RuleGroupReorderRootDto,
  ): RuleGroupUpdateResponseDto {
    return {
      status: 'success',
      groupId: body.items[0]?.id ?? crypto.randomUUID(),
    }
  }

  @Delete('rule-groups/:groupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archive rule group',
    description: 'Performs soft delete of a rule group',
    operationId: 'delete_rule_group',
    tags: [ApiSwaggerTag.RuleGroup],
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully archived',
    type: RuleGroupRemoveResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to this rule group',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule group not found',
  })
  deleteRuleGroup(@Param('groupId', ParseUUIDPipe) groupId: string): RuleGroupRemoveResponseDto {
    return {
      status: 'success',
      groupId,
      archivedAt: new Date().toISOString(),
    }
  }
}
