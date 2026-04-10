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
  Req,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { type Request } from 'express'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import { ExportService } from '~/modules/export/application/export.service'
import { ResolvedRule } from '~/modules/export/application/export.types'
import { ExportRulesetResponse } from '~/modules/export/infra/http/export.dto'
import { EXPORT_PORT } from '~/modules/export/ports/export.service.port'
import { PROJECT_PORT, type ProjectServicePort } from '~/modules/project/ports/project.service.port'
import { RuleGroupService } from '~/modules/rule-group/application/rule-group.service'
import { RuleGroup } from '~/modules/rule-group/application/rule-group.types'
import {
  CreateRuleGroupDto,
  DeleteRuleGroupResponse,
  ReorderRuleGroupDto,
  ReorderRuleGroupsResponse,
  RuleGroupResponse,
  UpdateRuleGroupDto,
} from '~/modules/rule-group/infra/http/rule-group.dto'
import { RULE_GROUP_PORT } from '~/modules/rule-group/ports/rule-group.service.port'
import { RuleService } from '~/modules/rule/application/rule.service'
import { DeleteRuleRes, Rule } from '~/modules/rule/application/rule.types'
import {
  CreateRuleDto,
  DeleteRuleResponse,
  ReorderBodyDto,
  ReorderRuleResponse,
  RuleResponse,
  UpdateRuleDto,
} from '~/modules/rule/infra/http/rule.dto'
import { RULE_PORT } from '~/modules/rule/ports/rule.service.port'
import { TreeService } from '~/modules/tree/application/tree.service'
import { GetProjectTreeOutput } from '~/modules/tree/application/tree.types'
import { GetProjectTreeResponse } from '~/modules/tree/infra/http/tree.dto'
import { TREE_PORT } from '~/modules/tree/ports/tree.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'
import { Project } from '../../application/project.types'
import {
  CreateProjectDto,
  DeleteProjectResponse,
  ProjectResponse,
  UpdateProjectDto,
} from './project.dto'

@Controller({ path: 'projects', version: '1' })
export class ProjectController {
  constructor(
    // private readonly authService: AuthService,

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

  @ApiTags(ApiSwaggerTag.Project)
  @Post()
  // @UseGuards(SessionGuard)
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
  async createProject(@Body() body: CreateProjectDto, @Req() _req: Request): Promise<Project> {
    // const { activeOrganizationId } = await getSessionOrThrow(
    //   req,
    //   // this.authService,
    // )
    return await this.projectService.create(body, 'activeOrganizationId')
  }

  @ApiTags(ApiSwaggerTag.Project)
  @Get(':projectId')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<Project> {
    return await this.projectService.getById(req.activeOrganizationId, projectId)
  }

  @ApiTags(ApiSwaggerTag.Project)
  @Get()
  // @UseGuards(SessionGuard)
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
  async getProjects(@Req() req: Request): Promise<Project[]> {
    return await this.projectService.list(req.activeOrganizationId)
  }

  @ApiTags(ApiSwaggerTag.Project)
  @Patch(':projectId')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<Project> {
    return await this.projectService.update(req.activeOrganizationId, projectId, body)
  }

  @ApiTags(ApiSwaggerTag.Project)
  @Delete(':projectId')
  // @UseGuards(SessionGuard)
  @ApiOperation({
    summary: 'Delete project',
    description: 'Soft delete the project',
    operationId: 'delete_project',
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    type: String,
    format: 'uuid',
  })
  @ApiDataResponse({
    type: DeleteProjectResponse,
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
  async deleteProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Req() req: Request,
  ): Promise<DeleteRuleRes> {
    return await this.projectService.delete(req.activeOrganizationId, projectId)
  }

  // ==============================================  RULES
  @ApiTags(ApiSwaggerTag.Rule)
  @Post(':projectId/rules')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<Rule> {
    return await this.ruleService.create(req.activeOrganizationId, projectId, body)
  }

  @ApiTags(ApiSwaggerTag.Rule)
  @Patch(':projectId/rules/:ruleId')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<Rule> {
    const rule = await this.ruleService.update(req.activeOrganizationId, projectId, ruleId, body)
    return rule
  }

  @ApiTags(ApiSwaggerTag.Rule)
  @Delete(':projectId/rules/:ruleId')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<DeleteRuleRes> {
    return await this.ruleService.delete(req.activeOrganizationId, projectId, ruleId)
  }

  @ApiTags(ApiSwaggerTag.Rule)
  @Patch(':projectId/rules/reorder')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<ReorderRuleResponse> {
    return await this.ruleService.reorder(req.activeOrganizationId, projectId, body)
  }

  // ================================================== RULE GROUPS
  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Post(':projectId/rule-groups')
  // @UseGuards(SessionGuard)
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
    @Param('projectId', ParseUUIDPipe) _projectId: string,
    @Body() body: CreateRuleGroupDto,
    @Req() req: Request,
  ): Promise<RuleGroup> {
    return await this.ruleGroupService.create(req.activeOrganizationId, _projectId, body)
  }

  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Patch(':projectId/rule-groups/:groupId')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<RuleGroup> {
    return await this.ruleGroupService.update(req.activeOrganizationId, projectId, groupId, body)
  }

  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Delete(':projectId/rule-groups/:groupId')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<DeleteRuleGroupResponse> {
    return await this.ruleGroupService.delete(req.activeOrganizationId, projectId, groupId)
  }

  @ApiTags(ApiSwaggerTag.RuleGroup)
  @Patch(':projectId/rule-groups/reorder')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<ReorderRuleGroupsResponse> {
    return await this.ruleGroupService.reorder(req.activeOrganizationId, projectId, body)
  }

  // ================================================== TREE
  @ApiTags(ApiSwaggerTag.Tree)
  @Get(':projectId/tree')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<GetProjectTreeOutput> {
    return await this.treeService.getProjectTree(req.activeOrganizationId, projectId)
  }

  // ================================================== EXPORT
  @ApiTags(ApiSwaggerTag.Export)
  @Get(':projectId/export')
  // @UseGuards(SessionGuard)
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
    @Req() req: Request,
  ): Promise<ResolvedRule[]> {
    return await this.exportService.exportProjectRuleset(req.activeOrganizationId, projectId)
  }
}
