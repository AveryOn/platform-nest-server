import {
  Body,
  Controller,
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

@ApiTags(ApiSwaggerTag.Project)
@Controller({ path: 'projects', version: '1' })
export class ProjectController {
  constructor(
    @Inject(PROJECT_PORT)
    private projectService: ProjectServicePort,
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
}
