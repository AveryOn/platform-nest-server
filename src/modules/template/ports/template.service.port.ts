import type {
  TemplateReqCmd,
  TemplateRes,
} from '~/modules/template/application/template.type'

export const TEMPLATE_SERVICE_PORT = Symbol('TEMPLATE_SERVICE_PORT')

export abstract class TemplateServicePort {
  abstract getList(
    cmd: TemplateReqCmd.getList,
  ): Promise<TemplateRes.getList>

  abstract getSnapshotList(
    cmd: TemplateReqCmd.getSnapshotList,
  ): Promise<TemplateRes.getSnapshotList>

  abstract getById(
    cmd: TemplateReqCmd.getById,
  ): Promise<TemplateRes.getById>
}
