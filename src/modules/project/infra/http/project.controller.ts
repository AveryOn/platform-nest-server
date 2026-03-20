import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import {
  PROJECT_PORT,
  type ProjectServicePort,
} from '~/modules/project/ports/project.service.port'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import { CreateProjectDto, ProjectResponse } from './project.dto'
import { Project } from '../../application/project.types'

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
  async createProject(
    @Body() body: CreateProjectDto,
  ): Promise<Project> {
    // const { activeOrganizationId } = await this.getSessionOrThrowUseCase.execute()
    return await this.projectService.create(body, 'abc123')
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
}
