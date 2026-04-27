import { Inject, Injectable } from '@nestjs/common'
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
  ) {}
}
