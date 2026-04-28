import { Inject, Injectable } from '@nestjs/common'
import { AppError } from '~/core/error/app-error'
import { ErrorEnum } from '~/core/error/app-error.dict'
import { LOGGER_PORT } from '~/core/logger/logger.port'
import type { AppLoggerService } from '~/core/logger/logger.service'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
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
    private readonly transaction: TransactionPort<TransactionContext>,

    @Inject(LOGGER_PORT)
    private readonly logger: AppLoggerService,
  ) {}

  async updateRuleGroupConfig(
    cmd: ProjectConfigReqCmd.updateRuleGroupConfig,
  ): Promise<ProjectConfigRes.updateRuleGroupConfig> {
    return await this.transaction.run(async (tx) => {
      const project = await this.configRepo.getProjectById(
        { projectId: cmd.projectId },
        tx,
      )

      if (!project) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Project not found',
        )
      }

      const ruleGroup = await this.configRepo.getRuleGroupInProject(
        {
          projectId: cmd.projectId,
          groupId: cmd.groupId,
        },
        tx,
      )

      if (!ruleGroup) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Rule group not found',
        )
      }

      const status = cmd.isActive
        ? ProjectConfigStatus.active
        : ProjectConfigStatus.hidden

      const config = await this.configRepo.upsertRuleGroupConfig(
        {
          projectId: cmd.projectId,
          groupId: cmd.groupId,
          status,
        },
        tx,
      )

      return {
        projectId: config.projectId,
        ruleGroupId: config.ruleGroupId,
        isActive: config.status === ProjectConfigStatus.active,
        status: config.status,
        updatedAt: this.toIsoString(config.updatedAt),
      }
    })
  }

  async updateRuleConfig(
    cmd: ProjectConfigReqCmd.updateRuleConfig,
  ): Promise<ProjectConfigRes.updateRuleConfig> {
    return await this.transaction.run(async (tx) => {
      const project = await this.configRepo.getProjectById(
        { projectId: cmd.projectId },
        tx,
      )

      if (!project) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Project not found',
        )
      }

      const rule = await this.configRepo.getRuleInProject(
        {
          projectId: cmd.projectId,
          ruleId: cmd.ruleId,
        },
        tx,
      )

      if (!rule) {
        throw new AppError(ErrorEnum.SOURCE_NOT_FOUND, this.logger).log(
          'Rule not found',
        )
      }

      const status = cmd.isActive
        ? ProjectConfigStatus.active
        : ProjectConfigStatus.hidden

      const config = await this.configRepo.upsertRuleConfig(
        {
          projectId: cmd.projectId,
          ruleId: cmd.ruleId,
          status,
        },
        tx,
      )

      return {
        projectId: config.projectId,
        ruleId: config.ruleId,
        isActive: config.status === ProjectConfigStatus.active,
        status: config.status,
        updatedAt: this.toIsoString(config.updatedAt),
      }
    })
  }

  private toIsoString(value: Date | string | null): string | null {
    if (!value) {
      return null
    }

    return value instanceof Date ? value.toISOString() : value
  }
}
