import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '../application/project.types'

export const PROJECT_PORT = Symbol('PROJECT_PORT')

export interface ProjectServicePort {
  create(
    data: CreateProjectInput,
    activeOrganizationId: string,
  ): Promise<Project>
  list(activeOrganizationId: string): Promise<Project[]>
  getById(activeOrganizationId: string, projectId: string): Promise<Project>
  update(
    activeOrganizationId: string,
    projectId: string,
    data: UpdateProjectInput,
  ): Promise<Project>
}
