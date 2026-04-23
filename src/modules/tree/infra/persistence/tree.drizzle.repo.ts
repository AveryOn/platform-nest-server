import { Injectable } from '@nestjs/common'
import type { TreeRepoPort } from '~/modules/tree/ports/tree.repo.port'

@Injectable()
export class TreeDrizzleRepo implements TreeRepoPort {}
