import { Inject, Injectable } from '@nestjs/common'
import { defineDb } from '~/infra/drizzle/application/drizzle.helpers'
import type { Tx } from '~/infra/drizzle/application/drizzle.type'
import {
  DRIZZLE_PORT,
  type DrizzleServicePort,
} from '~/infra/drizzle/ports/drizzle.service.port'
import type {
  ProjectRepoCmd,
  ProjectRepoRes,
} from '~/modules/project/application/project.type'
import type { ProjectRepoPort } from '~/modules/project/ports/project.repo.port'
import {
  PAGINATOR_PORT,
  type PaginatorServicePort,
} from '~/shared/paginator/ports/paginator.service.port'

@Injectable()
export class ProjectDrizzleRepo implements ProjectRepoPort {
  constructor(
    @Inject(DRIZZLE_PORT)
    private readonly drizzle: DrizzleServicePort,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,
  ) {}
  getList(
    cmd: ProjectRepoCmd.GetList,
    tx?: Tx,
  ): Promise<ProjectRepoRes.GetList> {
    const db = defineDb(this.drizzle.db, tx)
    const { skip, take } = this.paginator.config({ limit: 10, page: 10 })
    const { limit, page, total, totalPages } = this.paginator.response({
      data: [],
      total: 100,
    })
    throw new Error('Method not implemented.')
  }
  getById(
    cmd: ProjectRepoCmd.GetById,
    tx?: Tx,
  ): Promise<ProjectRepoRes.GetById> {
    const db = defineDb(this.drizzle.db, tx)
    throw new Error('Method not implemented.')
  }
  create(
    cmd: ProjectRepoCmd.Create,
    tx?: Tx,
  ): Promise<ProjectRepoRes.Create> {
    const db = defineDb(this.drizzle.db, tx)
    throw new Error('Method not implemented.')
  }
  update(
    cmd: ProjectRepoCmd.Update,
    tx?: Tx,
  ): Promise<ProjectRepoRes.Update> {
    const db = defineDb(this.drizzle.db, tx)
    throw new Error('Method not implemented.')
  }
  delete(
    cmd: ProjectRepoCmd.Delete,
    tx?: Tx,
  ): Promise<ProjectRepoRes.Delete> {
    const db = defineDb(this.drizzle.db, tx)
    throw new Error('Method not implemented.')
  }
}
