import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ProjectSnapshotCreateDto,
  ProjectSnapshotItemResponseDto,
  ProjectSnapshotPayloadResponseDto,
  ProjectSnapshotStatusResponseDto,
  ProjectSnapshotsListResponseDto,
} from '~/modules/snapshot/infra/http/snapshot.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Snapshot)
@Controller({
  path: 'projects',
  version: '1',
})
export class SnapshotController {
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project snapshots list successfully returned',
    type: ProjectSnapshotsListResponseDto,
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
  getProjectSnapshots(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
  ): ProjectSnapshotsListResponseDto {
    return {
      projectId,
      total: 1,
      items: [
        {
          id: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
          projectId,
          version: 1,
          hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
          createdAt: '2026-04-20T12:45:00.000Z',
        },
      ],
    }
  }

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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project snapshot successfully created',
    type: ProjectSnapshotItemResponseDto,
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
  createProjectSnapshot(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Body()
    _body: ProjectSnapshotCreateDto,
  ): ProjectSnapshotItemResponseDto {
    return {
      id: crypto.randomUUID(),
      projectId,
      version: 2,
      hash: '4ae7c3b6ac0beff671efa0e5b9f9b2f7ff38e44b6d7af1b70987f2c8472f5520',
      createdAt: new Date().toISOString(),
    }
  }

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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project snapshot successfully returned',
    type: ProjectSnapshotItemResponseDto,
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
  getProjectSnapshotById(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('snapshotId', ParseUUIDPipe)
    snapshotId: string,
  ): ProjectSnapshotItemResponseDto {
    return {
      id: snapshotId,
      projectId,
      version: 1,
      hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
      createdAt: '2026-04-20T12:45:00.000Z',
    }
  }

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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project snapshot by version successfully returned',
    type: ProjectSnapshotItemResponseDto,
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
  getProjectSnapshotByVersion(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('version', ParseIntPipe)
    version: number,
  ): ProjectSnapshotItemResponseDto {
    return {
      id: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
      projectId,
      version,
      hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
      createdAt: '2026-04-20T12:45:00.000Z',
    }
  }

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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project snapshot payload successfully returned',
    type: ProjectSnapshotPayloadResponseDto,
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
  getProjectSnapshotPayload(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
    @Param('snapshotId', ParseUUIDPipe)
    snapshotId: string,
  ): ProjectSnapshotPayloadResponseDto {
    return {
      snapshotId,
      projectId,
      version: 1,
      payload: {
        rules: [
          {
            id: 'b9cbfc46-f42f-4a9c-9e5f-d3d5b88d9ec7',
            title: 'When to use',
            body: 'Use button for primary actions.',
            path: ['Components', 'Button', 'When to use'],
            orderKey: '0001.0001.0001',
          },
        ],
      },
    }
  }

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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project snapshot status successfully returned',
    type: ProjectSnapshotStatusResponseDto,
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
  getProjectSnapshotStatus(
    @Param('projectId', ParseUUIDPipe)
    projectId: string,
  ): ProjectSnapshotStatusResponseDto {
    return {
      projectId,
      hasSnapshots: true,
      isOutdated: false,
      latestSnapshotId: '4d52ad0c-5506-4fd0-a6c9-0da4bbf8f8bb',
      latestVersion: 1,
      lastCreatedAt: '2026-04-20T12:45:00.000Z',
    }
  }
}
