import type {
  ExportServiceCmd,
  ExportServiceRes,
} from '~/modules/export/application/export.type'

export const EXPORT_SERVICE_PORT = Symbol('EXPORT_SERVICE_PORT')

export abstract class ExportServicePort {
  abstract export(
    cmd: ExportServiceCmd.Export,
  ): Promise<ExportServiceRes.Export>
}
