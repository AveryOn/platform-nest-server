import { Injectable } from '@nestjs/common'
import type { ProjectRepoPort } from '~/modules/project/ports/project.repo.port'

@Injectable()
export class ProjectDrizzleRepo implements ProjectRepoPort {}
