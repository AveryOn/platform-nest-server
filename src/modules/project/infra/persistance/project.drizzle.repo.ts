import { Injectable } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import type { CreateProjectInput, Project } from '~/modules/project/application/project.types'
import { ProjectRepoPort } from '~/modules/project/ports/project.repo.port'

@Injectable()
export class ProjectDrizzleRepo implements ProjectRepoPort {
  constructor(private readonly drizzle: DrizzleService) {}
  create: (body: CreateProjectInput) => Promise<Project>
  findManyByOrganization: (activeOrganizationId: string) => Promise<Project[]>
  findById: (projectId: string) => Promise<Project>
}
