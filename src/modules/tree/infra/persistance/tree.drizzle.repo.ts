import { Injectable } from '@nestjs/common'
import { DrizzleService } from '~/infra/drizzle/drizzle.service'
import { TreeRepoPort } from '~/modules/tree/ports/tree.repo.port'

@Injectable()
export class TreeDrizzleRepo implements TreeRepoPort {
  constructor(private readonly drizzle: DrizzleService) {}
}
