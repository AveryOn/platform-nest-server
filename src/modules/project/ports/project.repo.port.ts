import {
  CreateProjectInput,
  Project,
} from '~/modules/project/application/project.types'

export const PROJECT_REPO_PORT = Symbol('PROJECT_REPO_PORT')

export interface ProjectRepoPort {
  create: (body: CreateProjectInput) => Promise<Project>
  findManyByOrganization: (activeOrganizationId: string) => Promise<Project[]>
  findById: (projectId: string) => Promise<Project>
}
