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
  ProjectCreateDto,
  ProjectGetListQuery,
  ProjectItemResponse,
  ProjectListItemResponse,
  ProjectPatchDto,
  ProjectPatchResponse,
  ProjectRemoveResponse,
} from '~/modules/project/infra/http/project.dto'
import {
  PROJECT_SERVICE_PORT,
  type ProjectServicePort,
} from '~/modules/project/ports/project.service.port'
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
  constructor(
    @Inject(PROJECT_SERVICE_PORT)
    private readonly projectService: ProjectServicePort,
  ) {}
  // ------------------------------------------
  // [GET] | GET PROJECTS LIST
  // #region GET-------------------------------
  @Get()
  @UseGuards(SessionGuard)
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
  async getProjects(
    @ValidQuery(ProjectGetListQuery)
    query: ProjectGetListQuery,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<PaginatedResponse<ProjectListItemResponse>> {
    return await this.projectService.getList({
      organizationId: auth.activeOrganizationId,
      limit: query.limit,
      page: query.page,
      brandId: query.brandId,
      includeArchived: query.includeArchived,
      search: query.search,
    })
  }

  // ------------------------------------------
  // [GET] | GET PROJECT BY ID
  // ------------------------------------------
  @Get(':projectId')
  @UseGuards(SessionGuard)
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
  async getProjectById(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<ProjectItemResponse> {
    return await this.projectService.getById({
      organizationId: auth.activeOrganizationId,
      projectId,
    })
  }

  // #endregion------------------------------------------
  // [POST] | CREATE PROJECT
  // #region POST---------------------------------------
  @Post()
  @UseGuards(SessionGuard)
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
  async createProject(
    @Body()
    body: ProjectCreateDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<ProjectItemResponse> {
    return await this.projectService.create({
      name: body.name,
      organizationId: auth.activeOrganizationId,
      brandId: body.brandId,
      description: body.description,
      templateSnapshotId: body.templateSnapshotId,
      slug: body.slug,
    })
  }

  // #endregion------------------------------------------
  // [PATCH] | UPDATE PROJECT
  // #region PATCH---------------------------------------
  @Patch(':projectId')
  @UseGuards(SessionGuard)
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
  async patchProject(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @Body()
    body: ProjectPatchDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<ProjectPatchResponse> {
    return await this.projectService.update({
      organizationId: auth.activeOrganizationId,
      brandId: body.brandId,
      projectId,
      description: body.description,
      name: body.name,
      templateSnapshotId: body.templateSnapshotId,
    })
  }

  // #endregion------------------------------------------
  // [DELETE] | ARCHIVE PROJECT
  // #region DELETE---------------------------------------
  @Delete(':projectId')
  @UseGuards(SessionGuard)
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
  async deleteProject(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<ProjectRemoveResponse> {
    return await this.projectService.delete({
      organizationId: auth.activeOrganizationId,
      projectId,
    })
  }
}
