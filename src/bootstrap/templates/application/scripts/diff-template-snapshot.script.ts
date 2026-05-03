import type { INestApplicationContext } from '@nestjs/common'
import { TemplateSnapshotService } from '~/bootstrap/templates/application/service/template-snapshot.service'

export function diffTemplateSnapshots(app: INestApplicationContext) {
  const service = app.get(TemplateSnapshotService)

  return service.diffTemplates()
}
