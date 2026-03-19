import { Inject, Injectable } from '@nestjs/common'
import { ExportServicePort } from '~/modules/export/ports/export.service.port'
import {
  EXPORT_REPO_PORT,
  type ExportRepoPort,
} from '~/modules/export/ports/export.repo.port'

@Injectable()
export class ExportService implements ExportServicePort {
  constructor(
    @Inject(EXPORT_REPO_PORT)
    private readonly exportRepo: ExportRepoPort,
  ) {}
}
