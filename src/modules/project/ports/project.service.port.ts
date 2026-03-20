import { CreateProjectInput, Project } from "../application/project.types"

export const PROJECT_PORT = Symbol('PROJECT_PORT')

export interface ProjectServicePort {
    create(data: CreateProjectInput, activeOrganizationId: string): Promise<Project>
    list(activeOrganizationId: string): Promise<Project[]>
}
