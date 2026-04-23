import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  ProjectConfigStatus,
  ProjectRuleConfigPatchDto,
  ProjectRuleConfigResponseDto,
  ProjectRuleGroupConfigPatchDto,
  ProjectRuleGroupConfigResponseDto,
} from '~/modules/project-config/infra/http/project-config.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.ProjectConfig)
@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectConfigController {
  @Patch(':projectId/rule-groups/:groupId/config')
  @ApiOperation({
    summary: 'Patch project rule group config',
    description:
      'Updates project-level config for a specific rule group',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project rule group config successfully updated',
    type: ProjectRuleGroupConfigResponseDto,
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
  patchRuleGroupConfig(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('groupId', ParseUUIDPipe)
    groupId: string,
    @Body()
    body: ProjectRuleGroupConfigPatchDto,
  ): ProjectRuleGroupConfigResponseDto {
    return {
      projectId,
      ruleGroupId: groupId,
      isHidden: body.isHidden ?? false,
      isActive: body.isActive ?? true,
      status: ProjectConfigStatus.success,
      updatedAt: new Date().toISOString(),
    }
  }

  @Patch(':projectId/rules/:ruleId/config')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project rule config successfully updated',
    type: ProjectRuleConfigResponseDto,
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
  patchRuleConfig(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('ruleId', ParseUUIDPipe)
    ruleId: string,
    @Body()
    body: ProjectRuleConfigPatchDto,
  ): ProjectRuleConfigResponseDto {
    return {
      projectId,
      ruleId,
      isHidden: body.isHidden ?? false,
      isActive: body.isActive ?? true,
      status: ProjectConfigStatus.success,
      updatedAt: new Date().toISOString(),
    }
  }
}
