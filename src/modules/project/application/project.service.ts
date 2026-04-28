import { Inject, Injectable } from '@nestjs/common'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import type { AppLoggerService } from '~/core/logger/logger.service'
import type {
  ProjectReqCmd,
  ProjectRes,
} from '~/modules/project/application/project.type'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'
import type { ProjectServicePort } from '~/modules/project/ports/project.service.port'

@Injectable()
export class ProjectService implements ProjectServicePort {
  constructor(
    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {}

  async getList(cmd: ProjectReqCmd.GetList): Promise<ProjectRes.GetList> {
    return await this.projectRepo.getList(cmd)
  }

  async getById(cmd: ProjectReqCmd.GetById): Promise<ProjectRes.GetById> {
    const project = await this.projectRepo.getById(cmd)

    if (!project) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Project not found',
      )
    }

    return project
  }

  async create(cmd: ProjectReqCmd.Create): Promise<ProjectRes.Create> {
    return await this.projectRepo.create(cmd)
  }

  async update(cmd: ProjectReqCmd.Update): Promise<ProjectRes.Update> {
    const project = await this.projectRepo.getById({
      projectId: cmd.projectId,
    })

    if (!project) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Project not found',
      )
    }

    return await this.projectRepo.update(cmd)
  }

  async delete(cmd: ProjectReqCmd.Delete): Promise<ProjectRes.Delete> {
    const project = await this.projectRepo.getById({
      projectId: cmd.projectId,
    })

    if (!project) {
      throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
        'Project not found',
      )
    }

    return await this.projectRepo.delete(cmd)
  }
}
