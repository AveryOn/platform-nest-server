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
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  RuleCreateDto,
  RuleItemResponseDto,
  RuleMoveDto,
  RulePatchDto,
  RuleRemoveResponseDto,
  RuleReorderInGroupDto,
  RuleUpdateResponseDto,
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Rule successfully created',
    type: RuleItemResponseDto,
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
  ): Promise<RuleItemResponseDto> {
    return await this.ruleService.create({
      title: body.title,
      body: body.body,
      orderIndex: body.orderIndex,
      ruleGroupId: groupId,
      metadata: body.metadata,
    })
  }

  @Get('rules/:ruleId')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully returned',
    type: RuleItemResponseDto,
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
  ): Promise<RuleItemResponseDto> {
    return await this.ruleService.getById({
      ruleId: ruleId,
    })
  }

  @Patch('rules/:ruleId')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully updated',
    type: RuleUpdateResponseDto,
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
  ): Promise<RuleUpdateResponseDto> {
    return await this.ruleService.patch({
      ruleId: ruleId,
      body: body.body,
      metadata: body.metadata,
      title: body.title,
    })
  }

  @Post('rules/:ruleId/move')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully moved',
    type: RuleUpdateResponseDto,
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
  ): Promise<RuleUpdateResponseDto> {
    return await this.ruleService.move({
      orderIndex: body.orderIndex,
      targetGroupId: body.targetGroupId,
      ruleId: ruleId,
    })
  }

  @Post('rule-groups/:groupId/reorder-rules')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reorder rules in group',
    description:
      'Reorders direct rules inside the specified rule group',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rules successfully reordered',
    type: RuleUpdateResponseDto,
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
  ): Promise<RuleUpdateResponseDto> {
    return await this.ruleService.reorderInGroup({
      groupId: groupId,
      items: body.items,
    })
  }

  @Delete('rules/:ruleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archive rule',
    description: 'Performs soft delete of a rule',
    operationId: 'delete_rule',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule successfully archived',
    type: RuleRemoveResponseDto,
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
  ): Promise<RuleRemoveResponseDto> {
    return await this.ruleService.remove({ ruleId })
  }
}
