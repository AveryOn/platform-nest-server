import type {
  ProjectReqCmd,
  ProjectRes,
} from '~/modules/project/application/project.type'

export const PROJECT_SERVICE_PORT = Symbol('PROJECT_SERVICE_PORT')

export abstract class ProjectServicePort {
  abstract getList(
    cmd: ProjectReqCmd.GetList,
  ): Promise<ProjectRes.GetList>

  abstract getById(
    cmd: ProjectReqCmd.GetById,
  ): Promise<ProjectRes.GetById>

  abstract create(cmd: ProjectReqCmd.Create): Promise<ProjectRes.Create>

  abstract update(cmd: ProjectReqCmd.Update): Promise<ProjectRes.Update>

  abstract delete(cmd: ProjectReqCmd.Delete): Promise<ProjectRes.Delete>
}
