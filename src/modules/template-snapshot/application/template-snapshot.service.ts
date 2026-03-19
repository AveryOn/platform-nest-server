import { Inject, Injectable } from '@nestjs/common'
import { TemplateSnapshotServicePort } from '~/modules/template-snapshot/ports/template-snapshot.service.port'
import {
  TEMPLATE_SNAPSHOT_REPO_PORT,
  type TemplateSnapshotRepoPort,
} from '~/modules/template-snapshot/ports/template-snapshot.repo.port'

@Injectable()
export class TemplateSnapshotService implements TemplateSnapshotServicePort {
  constructor(
    @Inject(TEMPLATE_SNAPSHOT_REPO_PORT)
    private readonly templateSnapshotRepo: TemplateSnapshotRepoPort,
  ) {}
}
