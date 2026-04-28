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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import {
  ProjectCreateDto,
  ProjectGetListQuery,
  ProjectItemResponse,
  ProjectListItemResponse,
  ProjectPatchDto,
  ProjectPatchResponse,
  ProjectRemoveResponse,
} from '~/modules/project/infra/http/project.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'
import { ValidQuery } from '~/shared/decorators/query'
import type { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'
import { ApiPaginator } from '~/shared/paginator/infra/http/paginator.swagger.helper'

@ApiTags(ApiSwaggerTag.Project)
@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectController {
  // ------------------------------------------
  // [GET] | GET PROJECTS LIST
  // #region GET-------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get projects list',
    description:
      'Returns paginated list of projects available in current organization context',
    operationId: 'get_projects_list',
    tags: [ApiSwaggerTag.Project],
  })
  @ApiPaginator({
    query: {
      type: ProjectGetListQuery,
    },
    response: {
      status: HttpStatus.OK,
      description: 'Projects list successfully returned',
      type: ProjectListItemResponse,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid query parameters',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to organization projects',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  getProjects(
    @ValidQuery(ProjectGetListQuery)
    _query: ProjectGetListQuery,
  ): PaginatedResponse<ProjectListItemResponse> {
    return {}
  }

  // ------------------------------------------
  // [GET] | GET PROJECT BY ID
  // ------------------------------------------
  @Get(':projectId')
  @ApiOperation({
    summary: 'Get project by id',
    description: 'Returns project details by UUID',
    operationId: 'get_project_by_id',
    tags: [ApiSwaggerTag.Project],
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    example: SWAGGER_EXAMPLES.uuid,
    type: String,
    format: 'uuid',
    description: 'Project UUID',
  })
  @ApiDataResponse({
    type: ProjectItemResponse,
    status: HttpStatus.OK,
    description: 'Project successfully returned',
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
  getProjectById(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
  ): ProjectItemResponse {
    return {
      id: projectId,
      name: 'Main Design System',
      description: 'Main product project',
      brandId: 'c6f33564-2c64-4f7c-bb6f-6e3d7ef21671',
      organizationId: 'org_123456',
      templateSnapshotId: '2c0c5af8-7d26-4dd4-a8d6-2f8b0658f1a2',
      isArchived: false,
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
    }
  }

  // #endreion------------------------------------------
  // [POST] | CREATE PROJECT
  // #region POST---------------------------------------
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create project',
    description:
      'Creates a new project inside active organization context',
    operationId: 'create_project',
    tags: [ApiSwaggerTag.Project],
  })
  @ApiBody({
    type: ProjectCreateDto,
    description: 'Payload for creating a project',
  })
  @ApiDataResponse({
    type: ProjectItemResponse,
    status: HttpStatus.CREATED,
    description: 'Project successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid request body',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. No rights to create project in current organization',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Referenced brand or template snapshot not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Conflict. Project with same unique constraints already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  createProject(
    @Body()
    body: ProjectCreateDto,
  ): ProjectItemResponse {
    return {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description ?? null,
      brandId: body.brandId ?? null,
      organizationId: 'org_123456',
      templateSnapshotId: body.templateSnapshotId ?? null,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  // #endreion------------------------------------------
  // [PATCH] | UPDATE PROJECT
  // #region PATCH---------------------------------------
  @Patch(':projectId')
  @ApiOperation({
    summary: 'Update project',
    description: 'Updates mutable project fields',
    operationId: 'patch_project',
    tags: [ApiSwaggerTag.Project],
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
    type: ProjectPatchDto,
    required: true,
    description: 'Payload for updating project fields',
  })
  @ApiDataResponse({
    type: ProjectPatchResponse,
    status: HttpStatus.OK,
    description: 'Project successfully updated',
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
    description: 'Project, brand, or template snapshot not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Conflict. Update violates unique or ownership constraints',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  patchProject(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Body()
    _body: ProjectPatchDto,
  ): ProjectPatchResponse {
    return {
      status: 'success',
      projectId,
    }
  }

  // #endreion------------------------------------------
  // [DELETE] | ARCHIVE PROJECT
  // #region DELETE---------------------------------------
  @Delete(':projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archive project',
    description: 'Performs soft delete of project by marking it archived',
    operationId: 'delete_project',
    tags: [ApiSwaggerTag.Project],
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    description: 'Project UUID',
  })
  @ApiDataResponse({
    type: ProjectRemoveResponse,
    status: HttpStatus.OK,
    description: 'Project successfully archived',
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
    description: 'Forbidden. No access to this project',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found',
  })
  deleteProject(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
  ): ProjectRemoveResponse {
    return {
      status: 'success',
      projectId,
      archivedAt: new Date().toISOString(),
    }
  }
}
