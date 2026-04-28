import { Inject, Injectable } from '@nestjs/common'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import {
  ProjectConfigStatus,
  type ProjectConfigReqCmd,
  type ProjectConfigRes,
} from '~/modules/project-config/application/project-config.type'
import {
  PROJECT_CONFIG_REPO_PORT,
  type ProjectConfigRepoPort,
} from '~/modules/project-config/ports/project-config.repo.port'
import type { ProjectConfigServicePort } from '~/modules/project-config/ports/project-config.service.port'

@Injectable()
export class ProjectConfigService implements ProjectConfigServicePort {
  constructor(
    @Inject(PROJECT_CONFIG_REPO_PORT)
    private readonly configRepo: ProjectConfigRepoPort,

    @Inject(TX_PORT)
    private readonly transaction: TransactionPort,
  ) {}
  async updateRuleGroupConfig(
    cmd: ProjectConfigReqCmd.updateRuleGroupConfig,
  ): Promise<ProjectConfigRes.updateRuleGroupConfig> {
    await this.transaction.run(async (tx) => {
      return Promise.resolve({
        projectId: cmd.projectId,
        ruleGroupId: cmd.groupId,
        isHidden: cmd.isHidden ?? false,
        isActive: cmd.isActive ?? true,
        status: ProjectConfigStatus.active,
        updatedAt: new Date().toISOString(),
      })
    })
    throw new Error('Method not implemented.')
  }

  async updateRuleConfig(
    cmd: ProjectConfigReqCmd.updateRuleConfig,
  ): Promise<ProjectConfigRes.updateRuleConfig> {
    return await Promise.resolve({
      projectId: cmd.projectId,
      ruleId: cmd.ruleId,
      isHidden: cmd.isHidden ?? false,
      isActive: cmd.isActive ?? true,
      status: ProjectConfigStatus.active,
      updatedAt: new Date().toISOString(),
    })
  }
}
