import { Inject, Injectable } from '@nestjs/common'
import type {
  ExportServiceCmd,
  ExportServiceRes,
} from '~/modules/export/application/export.type'
import {
  EXPORT_REPO_PORT,
  type ExportRepoPort,
} from '~/modules/export/ports/export.repo.port'
import type { ExportServicePort } from '~/modules/export/ports/export.service.port'

@Injectable()
export class ExportService implements ExportServicePort {
  constructor(
    @Inject(EXPORT_REPO_PORT)
    private readonly exportRepo: ExportRepoPort,
  ) {}

  async export(
    cmd: ExportServiceCmd.Export,
  ): Promise<ExportServiceRes.Export> {
    await Promise.resolve()
    throw new Error('Method not implemented.')
  }
}
