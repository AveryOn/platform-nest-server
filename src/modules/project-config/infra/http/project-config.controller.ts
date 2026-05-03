import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
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
  ProjectRuleConfigPatchDto,
  ProjectRuleConfigRes,
  ProjectRuleGroupConfigPatchDto,
  ProjectRuleGroupConfigRes,
} from '~/modules/project-config/infra/http/project-config.dto'
import {
  PROJECT_CONFIG_SERVICE_PORT,
  type ProjectConfigServicePort,
} from '~/modules/project-config/ports/project-config.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.ProjectConfig)
@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectConfigController {
  constructor(
    @Inject(PROJECT_CONFIG_SERVICE_PORT)
    private readonly configService: ProjectConfigServicePort,
  ) {}

  @Patch(':projectId/rule-groups/:groupId/config')
  @UseGuards(SessionGuard)
  @ApiOperation({
    summary: 'Patch project rule group config',
    description: 'Updates project-level config for a specific rule group',
    operationId: 'patch_project_rule_group_config',
    tags: [ApiSwaggerTag.ProjectConfig],
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
    example: '8fd2dbff-e5e7-4781-b22c-b17d061ee8d7',
    type: String,
    format: 'uuid',
    description: 'Rule group UUID',
  })
  @ApiBody({
    type: ProjectRuleGroupConfigPatchDto,
    description: 'Project rule group config patch payload',
    required: true,
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Project rule group config successfully updated',
    type: ProjectRuleGroupConfigRes,
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
    description: 'Forbidden. No access to this project or rule group',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or rule group not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async patchRuleGroupConfig(
    @OrgAuthReq()
    auth: OrgAuthReqPayload,

    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Param('groupId', ParseUUIDPipe)
    groupId: string,

    @Body()
    body: ProjectRuleGroupConfigPatchDto,
  ): Promise<ProjectRuleGroupConfigRes> {
    return await this.configService.updateRuleGroupConfig({
      organizationId: auth.activeOrganizationId,
      groupId: groupId,
      projectId: projectId,
      isActive: body.isActive,
    })
  }

  @Patch(':projectId/rules/:ruleId/config')
  @UseGuards(SessionGuard)
  @ApiOperation({
    summary: 'Patch project rule config',
    description: 'Updates project-level config for a specific rule',
    operationId: 'patch_project_rule_config',
    tags: [ApiSwaggerTag.ProjectConfig],
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
    name: 'ruleId',
    required: true,
    example: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
    type: String,
    format: 'uuid',
    description: 'Rule UUID',
  })
  @ApiBody({
    type: ProjectRuleConfigPatchDto,
    description: 'Project rule config patch payload',
    required: true,
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Project rule config successfully updated',
    type: ProjectRuleConfigRes,
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
    description: 'Forbidden. No access to this project or rule',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or rule not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async patchRuleConfig(
    @OrgAuthReq()
    auth: OrgAuthReqPayload,

    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Param('ruleId', ParseUUIDPipe)
    ruleId: string,

    @Body()
    body: ProjectRuleConfigPatchDto,
  ): Promise<ProjectRuleConfigRes> {
    return await this.configService.updateRuleConfig({
      organizationId: auth.activeOrganizationId,
      projectId: projectId,
      ruleId: ruleId,
      isActive: body.isActive,
    })
  }
}
