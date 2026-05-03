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
  RuleCreateDto,
  RuleDeleteRes,
  RuleItemRes,
  RuleMoveDto,
  RuleMoveRes,
  RulePatchDto,
  RuleReorderInGroupDto,
  RuleReorderInGroupRes,
  RuleUpdateRes,
} from '~/modules/rule/infra/http/rule.dto'
import {
  RULE_SERVICE_PORT,
  type RuleServicePort,
} from '~/modules/rule/ports/rule.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Rule)
@Controller({
  version: '1',
})
export class RuleController {
  constructor(
    @Inject(RULE_SERVICE_PORT)
    private readonly ruleService: RuleServicePort,
  ) {}

  @Post('rule-groups/:groupId/rules')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create rule',
    description: 'Creates a new rule inside the specified rule group',
    operationId: 'create_rule',
    tags: [ApiSwaggerTag.Rule],
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiBody({
    type: RuleCreateDto,
    description: 'Rule creation payload',
    required: true,
  })
  @ApiDataResponse({
    status: HttpStatus.CREATED,
    description: 'Rule successfully created',
    type: RuleItemRes,
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
    description:
      'Conflict. Invalid ordering or cross-project operation detected',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async createRule(
    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @Body()
    body: RuleCreateDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleItemRes> {
    return await this.ruleService.create({
      organizationId: auth.activeOrganizationId,
      name: body.name,
      body: body.body,
      orderIndex: body.orderIndex,
      ruleGroupId: groupId,
      metadata: body.metadata,
    })
  }

  @Post('rules/:ruleId/move')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Move rule',
    description: 'Moves a rule to another group and/or position',
    operationId: 'move_rule',
    tags: [ApiSwaggerTag.Rule],
  })
  @ApiParam({
    name: 'ruleId',
    required: true,
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    type: String,
    format: 'uuid',
    description: 'Rule UUID',
  })
  @ApiBody({
    type: RuleMoveDto,
    description: 'Rule move payload',
    required: true,
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully moved',
    type: RuleMoveRes,
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
    description: 'Forbidden. No access to this rule',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule or target rule group not found',
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
  async moveRule(
    @Param('ruleId', ParseUUIDPipe)
    ruleId: string,

    @Body()
    body: RuleMoveDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleMoveRes> {
    return await this.ruleService.move({
      organizationId: auth.activeOrganizationId,
      orderIndex: body.orderIndex,
      targetGroupId: body.targetGroupId,
      ruleId,
    })
  }

  @Post('rule-groups/:groupId/reorder-rules')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reorder rules in group',
    description: 'Reorders direct rules inside the specified rule group',
    operationId: 'reorder_rules_in_group',
    tags: [ApiSwaggerTag.Rule],
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiBody({
    type: RuleReorderInGroupDto,
    description: 'Rule reorder payload',
    required: true,
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rules successfully reordered',
    type: RuleReorderInGroupRes,
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
    description: 'Rule group or one of rules not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Conflict. Reorder input contains duplicate ids or foreign rules',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async reorderRulesInGroup(
    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @Body()
    body: RuleReorderInGroupDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleReorderInGroupRes> {
    return await this.ruleService.reorderInGroup({
      organizationId: auth.activeOrganizationId,
      groupId,
      items: body.items,
    })
  }

  @Get('rules/:ruleId')
  @UseGuards(SessionGuard)
  @ApiOperation({
    summary: 'Get rule by id',
    description: 'Returns rule details by UUID',
    operationId: 'get_rule_by_id',
    tags: [ApiSwaggerTag.Rule],
  })
  @ApiParam({
    name: 'ruleId',
    required: true,
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    type: String,
    format: 'uuid',
    description: 'Rule UUID',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully returned',
    type: RuleItemRes,
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
    description: 'Forbidden. No access to this rule',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found',
  })
  async getRuleById(
    @Param('ruleId', ParseUUIDPipe)
    ruleId: string,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleItemRes> {
    return await this.ruleService.getById({
      organizationId: auth.activeOrganizationId,
      ruleId,
    })
  }

  @Patch('rules/:ruleId')
  @UseGuards(SessionGuard)
  @ApiOperation({
    summary: 'Update rule',
    description: 'Updates mutable fields of a rule',
    operationId: 'patch_rule',
    tags: [ApiSwaggerTag.Rule],
  })
  @ApiParam({
    name: 'ruleId',
    required: true,
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    type: String,
    format: 'uuid',
    description: 'Rule UUID',
  })
  @ApiBody({
    type: RulePatchDto,
    description: 'Rule patch payload',
    required: true,
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully updated',
    type: RuleUpdateRes,
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
    description: 'Forbidden. No access to this rule',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Conflict. Update violates ordering or ownership constraints',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async patchRule(
    @Param('ruleId', ParseUUIDPipe)
    ruleId: string,

    @Body()
    body: RulePatchDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleUpdateRes> {
    return await this.ruleService.patch({
      organizationId: auth.activeOrganizationId,
      ruleId,
      body: body.body,
      metadata: body.metadata,
      name: body.name,
    })
  }

  @Delete('rules/:ruleId')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archive rule',
    description: 'Performs soft delete of a rule',
    operationId: 'archive_rule',
    tags: [ApiSwaggerTag.Rule],
  })
  @ApiParam({
    name: 'ruleId',
    required: true,
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    type: String,
    format: 'uuid',
    description: 'Rule UUID',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully archived',
    type: RuleDeleteRes,
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
    description: 'Forbidden. No access to this rule',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found',
  })
  async deleteRule(
    @Param('ruleId', ParseUUIDPipe)
    ruleId: string,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<RuleDeleteRes> {
    return await this.ruleService.delete({
      organizationId: auth.activeOrganizationId,
      ruleId,
    })
  }
}
