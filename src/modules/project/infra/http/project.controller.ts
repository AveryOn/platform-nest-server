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
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import {
  PROJECT_PORT,
  type ProjectServicePort,
} from '~/modules/project/ports/project.service.port'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import {
  CreateProjectDto,
  ProjectResponse,
  UpdateProjectDto,
} from './project.dto'
import { Project } from '../../application/project.types'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'
import {
  CreateRuleDto,
  DeleteRuleResponse,
  ReorderBodyDto,
  ReorderRuleResponse,
  RuleResponse,
  UpdateRuleDto,
} from '~/modules/rule/infra/http/rule.dto'
import { DeleteRuleRes, Rule } from '~/modules/rule/application/rule.types'
import { RULE_PORT } from '~/modules/rule/ports/rule.service.port'
import { RuleService } from '~/modules/rule/application/rule.service'
import {
  CreateRuleGroupDto,
  DeleteRuleGroupResponse,
  ReorderRuleGroupDto,
  ReorderRuleGroupsResponse,
  RuleGroupResponse,
  UpdateRuleGroupDto,
} from '~/modules/rule-group/infra/http/rule-group.dto'
import { RuleGroup } from '~/modules/rule-group/application/rule-group.types'
import { RuleGroupService } from '~/modules/rule-group/application/rule-group.service'
import { RULE_GROUP_PORT } from '~/modules/rule-group/ports/rule-group.service.port'
import { GetProjectTreeResponse } from '~/modules/tree/infra/http/tree.dto'
import { GetProjectTreeOutput } from '~/modules/tree/application/tree.types'
import { TREE_PORT } from '~/modules/tree/ports/tree.service.port'
import { TreeService } from '~/modules/tree/application/tree.service'
import { ExportRulesetResponse } from '~/modules/export/infra/http/export.dto'
import { ResolvedRule } from '~/modules/export/application/export.types'
import { EXPORT_PORT } from '~/modules/export/ports/export.service.port'
import { ExportService } from '~/modules/export/application/export.service'

@ApiTags(ApiSwaggerTag.Project)
@Controller({ path: 'projects', version: '1' })
export class ProjectController {
  constructor(
    @Inject(PROJECT_PORT)
    private projectService: ProjectServicePort,

    @Inject(RULE_PORT)
    private ruleService: RuleService,

    @Inject(RULE_GROUP_PORT)
    private ruleGroupService: RuleGroupService,

    @Inject(TREE_PORT)
    private treeService: TreeService,

    @Inject(EXPORT_PORT)
    private exportService: ExportService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create project',
    description: 'Create project in active organization',
    operationId: 'create_project',
  })
  @ApiDataResponse({
    type: ProjectResponse,
    status: HttpStatus.CREATED,
    description: 'Success',
  })
  @ApiCreatedResponse({
    type: ProjectResponse,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid body',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async createProject(@Body() body: CreateProjectDto): Promise<Project> {
    // const { activeOrganizationId } = await this.getSessionOrThrowUseCase.execute()
    return await this.projectService.create(body, 'abc123')
  }

  @Get(':projectId')
  @ApiOperation({
    summary: 'Get project by id',
    description: 'Get project with access check',
    operationId: 'get_project_by_id',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
    example: SWAGGER_EXAMPLES.uuid,
  })
  @ApiDataResponse({
    type: ProjectResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getProjectById(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<Project> {
    // const { activeOrganizationId } =
    // await this.getSessionOrThrowUseCase.execute()
    return await this.projectService.getById('abc123', projectId)
  }

  @Get()
  @ApiOperation({
    summary: 'Get projects list',
    description: 'Get all projects for active organization',
    operationId: 'get_projects_list',
  })
  @ApiDataResponse({
    type: Array<ProjectResponse>,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getProjects(): Promise<Project[]> {
    // const { activeOrganizationId } =
    // await this.getSessionOrThrowUseCase.execute()
    return await this.projectService.list('abc123')
  }

  @Patch(':projectId')
  @ApiOperation({
    summary: 'Update project',
    description: 'Update project with access check',
    operationId: 'update_project',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: ProjectResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid body or project id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async updateProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: UpdateProjectDto,
  ): Promise<Project> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()

    return await this.projectService.update('abc123', projectId, body)
  }

  // ==============================================  RULES
  @ApiTags(ApiSwaggerTag.Rule)
  @Post(':projectId/rules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create rule',
    description: 'Create rule in project group',
    operationId: 'create_rule',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: RuleResponse,
    status: HttpStatus.CREATED,
    description: 'Success',
  })
  @ApiCreatedResponse({
    type: RuleResponse,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid body or project id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or rule group not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async createRule(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: CreateRuleDto,
  ): Promise<Rule> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.ruleService.create('abc123', projectId, body)
  }

  @ApiTags(ApiSwaggerTag.Rule)
  @Patch(':projectId/rules/:ruleId')
  @ApiOperation({
    summary: 'Update rule',
    description: 'Update rule in project',
    operationId: 'update_rule',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'ruleId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: RuleResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid body or ids',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or rule not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async updateRule(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
    @Body() body: UpdateRuleDto,
  ): Promise<Rule> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.ruleService.update('abc123', projectId, ruleId, body)
  }

  @ApiTags(ApiSwaggerTag.Rule)
  @Delete(':projectId/rules/:ruleId')
  @ApiOperation({
    summary: 'Delete rule',
    description: 'Soft delete rule in project',
    operationId: 'delete_rule',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'ruleId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: DeleteRuleResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or rule not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async deleteRule(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
  ): Promise<DeleteRuleRes> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.ruleService.delete('abc123', projectId, ruleId)
  }

  @ApiTags(ApiSwaggerTag.Rule)
  @Patch(':projectId/rules/reorder')
  @ApiOperation({
    summary: 'Reorder rules',
    description: 'Reorder rules inside project group',
    operationId: 'reorder_rules',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: ReorderRuleResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. orderedIds must be a non-empty array',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async reorderRules(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: ReorderBodyDto,
  ): Promise<ReorderRuleResponse> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.ruleService.reorder('abc123', projectId, body)
  }

  // ================================================== RULE GROUPS
  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Post(':projectId/rule-groups')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create rule group',
    description: 'Create rule group in project',
    operationId: 'create_rule_group',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: RuleGroupResponse,
    status: HttpStatus.CREATED,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid body or project id',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async createRuleGroup(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: CreateRuleGroupDto,
  ): Promise<RuleGroup> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.ruleGroupService.create('abc123', projectId, body)
  }

  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Patch(':projectId/rule-groups/:groupId')
  @ApiOperation({
    summary: 'Update rule group',
    description: 'Update rule group in project',
    operationId: 'update_rule_group',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: RuleGroupResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid body or ids',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or rule group not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async updateRuleGroup(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() body: UpdateRuleGroupDto,
  ): Promise<RuleGroup> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.ruleGroupService.update(
      'abc123',
      projectId,
      groupId,
      body,
    )
  }

  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Delete(':projectId/rule-groups/:groupId')
  @ApiOperation({
    summary: 'Delete rule group',
    description: 'Soft delete rule group in project',
    operationId: 'delete_rule_group',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'groupId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: DeleteRuleGroupResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or rule group not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async deleteRuleGroup(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<DeleteRuleGroupResponse> {
    // const { activeOrganizationId } =
    // await this.getSessionOrThrowUseCase.execute()
    return await this.ruleGroupService.delete('abd123', projectId, groupId)
  }

  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Patch(':projectId/rule-groups/reorder')
  @ApiOperation({
    summary: 'Reorder rule groups',
    description: 'Reorder rule groups inside project parent group',
    operationId: 'reorder_rule_groups',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: ReorderRuleGroupsResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. orderedIds must be a non-empty array',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async reorderRuleGroups(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: ReorderRuleGroupDto,
  ): Promise<ReorderRuleGroupsResponse> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.ruleGroupService.reorder('abc123', projectId, body)
  }

  // ================================================== TREE
  @ApiTags(ApiSwaggerTag.Tree)
  @Get(':projectId/tree')
  @ApiOperation({
    summary: 'Get project rules tree',
    description: 'Get rule groups and rules tree for project',
    operationId: 'get_project_rules_tree',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: GetProjectTreeResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getProjectTree(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<GetProjectTreeOutput> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.treeService.getProjectTree('abc123', projectId)
  }

  // ================================================== EXPORT
  @ApiTags(ApiSwaggerTag.Export)
  @Get(':projectId/export')
  @ApiOperation({
    summary: 'Get resolved project ruleset',
    description: 'Get resolved ruleset from project tree',
    operationId: 'get_resolved_project_ruleset',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: ExportRulesetResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getResolvedProjectRuleset(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ResolvedRule[]> {
    // const { activeOrganizationId } =
    //   await this.getSessionOrThrowUseCase.execute()
    return await this.exportService.exportProjectRuleset('abc123', projectId)
  }
}
