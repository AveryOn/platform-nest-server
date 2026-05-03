import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import type { OrgAuthReqPayload } from '~/modules/auth/application/auth.types'
import { OrgAuthReq } from '~/modules/auth/infra/http/auth-request.decorator'
import { SessionGuard } from '~/modules/auth/infra/session.guard'
import {
  RuleGroupCreateDto,
  RuleGroupDeleteRes,
  RuleGroupItemRes,
  RuleGroupMoveDto,
  RuleGroupPatchDto,
  RuleGroupReorderChildrenDto,
  RuleGroupReorderRootDto,
  RuleGroupUpdateRes,
  type RuleGroupMoveRes,
  type RuleGroupReorderChildrenRes,
  type RuleGroupReorderRootRes,
} from '~/modules/rule-group/infra/http/rule-group.dto'
import {
  RULE_GROUP_SERVICE_PORT,
  type RuleGroupServicePort,
} from '~/modules/rule-group/ports/rule-group.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.RuleGroup)
@Controller({
  version: '1',
})
export class RuleGroupController {
  constructor(
    @Inject(RULE_GROUP_SERVICE_PORT)
    private readonly ruleGroupService: RuleGroupServicePort,
  ) {}

  @Post('projects/:projectId/rule-groups')
  @UseGuards(SessionGuard)
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
  @ApiDataResponse({
    status: HttpStatus.CREATED,
    description: 'Rule group successfully created',
    type: RuleGroupItemRes,
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
  async createRuleGroup(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Body()
    body: RuleGroupCreateDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleGroupItemRes> {
    return await this.ruleGroupService.create({
      organizationId: auth.activeOrganizationId,
      name: body.name,
      orderIndex: body.orderIndex,
      projectId: projectId,
      metadata: body.metadata,
      description: body.description,
      parentGroupId: body.parentGroupId,
      type: body.type,
    })
  }

  @Get('rule-groups/:groupId')
  @UseGuards(SessionGuard)
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
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully returned',
    type: RuleGroupItemRes,
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
  async getRuleGroupById(
    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleGroupItemRes> {
    return await this.ruleGroupService.getById({
      organizationId: auth.activeOrganizationId,
      groupId,
    })
  }

  @Patch('rule-groups/:groupId')
  @UseGuards(SessionGuard)
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
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully updated',
    type: RuleGroupUpdateRes,
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
  async patchRuleGroup(
    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @Body()
    body: RuleGroupPatchDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleGroupUpdateRes> {
    return await this.ruleGroupService.patch({
      organizationId: auth.activeOrganizationId,
      groupId: groupId,
      description: body.description,
      name: body.name,
      type: body.type,
    })
  }

  @Post('projects/:projectId/rule-groups/:groupId/move')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Move rule group',
    description: 'Moves a rule group to another parent and/or position',
    operationId: 'move_rule_group',
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
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully moved',
    type: RuleGroupUpdateRes,
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
    description:
      'Conflict. Invalid move operation or cross-project move detected',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async moveRuleGroup(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @Body()
    body: RuleGroupMoveDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleGroupMoveRes> {
    return await this.ruleGroupService.move({
      organizationId: auth.activeOrganizationId,
      projectId: projectId,
      groupId: groupId,
      orderIndex: body.orderIndex,
      parentGroupId: body.parentGroupId,
    })
  }

  @Post('rule-groups/:groupId/reorder-children')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reorder child rule groups',
    description:
      'Reorders direct child rule groups of the specified parent group',
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
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Child rule groups successfully reordered',
    type: RuleGroupUpdateRes,
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
    description:
      'Conflict. Reorder input contains invalid hierarchy or duplicate ids',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async reorderChildren(
    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @Body()
    body: RuleGroupReorderChildrenDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleGroupReorderChildrenRes> {
    return await this.ruleGroupService.reorderChildren({
      organizationId: auth.activeOrganizationId,
      groupId: groupId,
      items: body.items,
    })
  }

  @Post('projects/:projectId/rule-groups/reorder-root')
  @UseGuards(SessionGuard)
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
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Root rule groups successfully reordered',
    type: RuleGroupUpdateRes,
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
    description:
      'Conflict. Reorder input contains non-root groups or duplicate ids',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async reorderRootGroups(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Body()
    body: RuleGroupReorderRootDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleGroupReorderRootRes> {
    return await this.ruleGroupService.reorderRoot({
      organizationId: auth.activeOrganizationId,
      projectId: projectId,
      items: body.items,
    })
  }

  @Delete('projects/:projectId/rule-groups/:groupId')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archive rule group',
    description: 'Performs soft delete of a rule group',
    operationId: 'delete_rule_group',
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
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '5c0f7db5-cf42-4f0d-95a7-e8c0f2d96f0f',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule group successfully archived',
    type: RuleGroupDeleteRes,
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
  async deleteRuleGroup(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleGroupDeleteRes> {
    return await this.ruleGroupService.delete({
      organizationId: auth.activeOrganizationId,
      groupId: groupId,
      projectId: projectId,
    })
  }
}
