import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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
  ProjectSnapshotCreateDto,
  ProjectSnapshotItemRes,
  ProjectSnapshotPayloadRes,
  ProjectSnapshotStatusRes,
  ProjectSnapshotsListQuery,
} from '~/modules/snapshot/infra/http/snapshot.dto'
import {
  SNAPSHOT_SERVICE_PORT,
  type SnapshotServicePort,
} from '~/modules/snapshot/ports/snapshot.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { ValidQuery } from '~/shared/decorators/query'
import type { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'
import { ApiPaginator } from '~/shared/paginator/infra/http/paginator.swagger.helper'

@ApiTags(ApiSwaggerTag.Snapshot)
@Controller({
  path: 'projects',
  version: '1',
})
export class SnapshotController {
  constructor(
    @Inject(SNAPSHOT_SERVICE_PORT)
    private readonly snapshotService: SnapshotServicePort,
  ) {}

  // -----------------------------------------------------
  // [GET] | GET SNAPHOTS LIST
  // #region GET------------------------------------------
  @Get(':projectId/snapshots')
  @ApiOperation({
    summary: 'Get project snapshots list',
    description:
      'Returns the list of immutable snapshots for the specified project',
    operationId: 'get_project_snapshots_list',
    tags: [ApiSwaggerTag.Snapshot],
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    description: 'Project UUID',
  })
  @ApiPaginator({
    query: {
      type: ProjectSnapshotsListQuery,
    },
    response: {
      type: ProjectSnapshotItemRes,
      description: 'Project snapshots list successfully returned',
      status: HttpStatus.OK,
    },
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
  async getProjectSnapshots(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @ValidQuery(ProjectSnapshotsListQuery)
    query: ProjectSnapshotsListQuery,
  ): Promise<PaginatedResponse<ProjectSnapshotItemRes>> {
    return await this.snapshotService.getList({
      projectId,
      ...query,
    })
  }

  // ------------------------------------------
  // [GET] | GET SNAPSHOT BY ID
  // ------------------------------------------
  @Get(':projectId/snapshots/:snapshotId')
  @ApiOperation({
    summary: 'Get project snapshot by id',
    description: 'Returns snapshot metadata by snapshot UUID',
    operationId: 'get_project_snapshot_by_id',
    tags: [ApiSwaggerTag.Snapshot],
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
    name: 'snapshotId',
    required: true,
    example: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
    type: String,
    format: 'uuid',
    description: 'Snapshot UUID',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Project snapshot successfully returned',
    type: ProjectSnapshotItemRes,
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
    description: 'Forbidden. No access to this project snapshot',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or snapshot not found',
  })
  async getProjectSnapshotById(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('snapshotId', ParseUUIDPipe)
    snapshotId: string,
  ): Promise<ProjectSnapshotItemRes> {
    return await this.snapshotService.getById({
      projectId,
      snapshotId,
    })
  }

  // ------------------------------------------
  // [GET] | GET SNAPSHOT BY VERSION
  // ------------------------------------------
  @Get(':projectId/snapshots/version/:version')
  @ApiOperation({
    summary: 'Get project snapshot by version',
    description:
      'Returns snapshot metadata by project-local snapshot version',
    operationId: 'get_project_snapshot_by_version',
    tags: [ApiSwaggerTag.Snapshot],
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
    name: 'version',
    required: true,
    example: 1,
    type: Number,
    description: 'Snapshot version inside project scope',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Project snapshot by version successfully returned',
    type: ProjectSnapshotItemRes,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or version',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. No access to this project snapshot',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or snapshot version not found',
  })
  async getProjectSnapshotByVersion(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('version', ParseIntPipe)
    version: number,
  ): Promise<ProjectSnapshotItemRes> {
    return await this.snapshotService.getByVersion({
      projectId,
      version,
    })
  }

  // ------------------------------------------
  // [GET] | GET SNAPSHOT PAYLOAD
  // ------------------------------------------
  @Get(':projectId/snapshots/:snapshotId/payload')
  @ApiOperation({
    summary: 'Get project snapshot payload',
    description:
      'Returns the materialized snapshot payload for external consumption',
    operationId: 'get_project_snapshot_payload',
    tags: [ApiSwaggerTag.Snapshot],
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
    name: 'snapshotId',
    required: true,
    example: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
    type: String,
    format: 'uuid',
    description: 'Snapshot UUID',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Project snapshot payload successfully returned',
    type: ProjectSnapshotPayloadRes,
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
    description: 'Forbidden. No access to this project snapshot payload',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or snapshot not found',
  })
  async getProjectSnapshotPayload(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('snapshotId', ParseUUIDPipe)
    snapshotId: string,
  ): Promise<ProjectSnapshotPayloadRes> {
    return await this.snapshotService.getPayload({
      projectId,
      snapshotId,
    })
  }

  // ------------------------------------------
  // [GET] | GET SNAPSHOT STATUS
  // ------------------------------------------
  @Get(':projectId/snapshots/status')
  @ApiOperation({
    summary: 'Get project snapshot status',
    description:
      'Returns snapshot freshness status for the specified project',
    operationId: 'get_project_snapshot_status',
    tags: [ApiSwaggerTag.Snapshot],
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
    status: HttpStatus.OK,
    description: 'Project snapshot status successfully returned',
    type: ProjectSnapshotStatusRes,
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
  async getProjectSnapshotStatus(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
  ): Promise<ProjectSnapshotStatusRes> {
    return await this.snapshotService.getStatus({
      projectId,
    })
  }

  // #endregion -------------------------------------------
  // [POST] | CREATE PROJECT SNAPSHOT
  // #region POST -----------------------------------------
  @Post(':projectId/snapshots')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create project snapshot',
    description:
      'Creates a new immutable snapshot from the current resolved ruleset of the specified project',
    operationId: 'create_project_snapshot',
    tags: [ApiSwaggerTag.Snapshot],
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
    type: ProjectSnapshotCreateDto,
    description: 'Project snapshot creation payload',
    required: true,
  })
  @ApiDataResponse({
    status: HttpStatus.CREATED,
    description: 'Project snapshot successfully created',
    type: ProjectSnapshotItemRes,
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
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Conflict. Snapshot creation failed due to versioning or hashing conflict',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async createProjectSnapshot(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Body()
    body: ProjectSnapshotCreateDto,
  ): Promise<ProjectSnapshotItemRes> {
    return await this.snapshotService.create({
      projectId,
      reason: body.reason,
      skipIfUnchanged: body.skipIfUnchanged,
    })
  }
}
