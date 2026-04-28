import { Inject, Injectable } from '@nestjs/common'
import type {
  TemplateReqCmd,
  TemplateRes,
} from '~/modules/template/application/template.type'
import {
  TEMPLATE_REPO_PORT,
  type TemplateRepoPort,
} from '~/modules/template/ports/template.repo.port'
import type { TemplateServicePort } from '~/modules/template/ports/template.service.port'

@Injectable()
export class TemplateService implements TemplateServicePort {
  constructor(
    @Inject(TEMPLATE_REPO_PORT)
    private readonly templateRepo: TemplateRepoPort,
  ) {}
  async getList(
    cmd: TemplateReqCmd.getList,
  ): Promise<TemplateRes.getList> {
    return await Promise.resolve({
      data: [
        {
          id: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
          slug: 'shadcn-ui',
          name: 'shadcn/ui',
          description:
            'Default UI rules template based on shadcn/ui structure',
          createdAt: '2026-04-20T12:00:00.000Z',
          updatedAt: '2026-04-20T12:30:00.000Z',
        },
      ],
      paginator: {
        limit: 1,
        page: 1,
        total: 1,
        totalPages: 1,
      },
    })
  }

  async getSnapshotList(
    cmd: TemplateReqCmd.getSnapshotList,
  ): Promise<TemplateRes.getSnapshotList> {
    return Promise.resolve({
      data: [
        {
          id: '0d3fe3b9-a578-420e-9556-d316ece261d3',
          templateId: cmd.templateId,
          version: 1,
          hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
          createdAt: '2026-04-20T12:45:00.000Z',
        },
      ],
      paginator: {
        limit: 1,
        page: 1,
        total: 1,
        totalPages: 1,
      },
    })
  }
  async getById(
    cmd: TemplateReqCmd.getById,
  ): Promise<TemplateRes.getById> {
    return await Promise.resolve({
      id: cmd.templateId,
      slug: 'shadcn-ui',
      name: 'shadcn/ui',
      description:
        'Default UI rules template based on shadcn/ui structure',
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
    })
  }
}
