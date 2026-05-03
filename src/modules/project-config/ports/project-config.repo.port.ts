import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import type {
  ProjectConfigRepoCmd,
  ProjectConfigRepoRes,
} from '~/modules/project-config/application/project-config.type'

export const PROJECT_CONFIG_REPO_PORT = Symbol('PROJECT_CONFIG_REPO_PORT')

export abstract class ProjectConfigRepoPort {
  abstract getProjectById(
    cmd: ProjectConfigRepoCmd.getProjectById,
    tx?: TransactionContext,
  ): Promise<ProjectConfigRepoRes.getProjectById | null>

  abstract getRuleGroupInProject(
    cmd: ProjectConfigRepoCmd.getRuleGroupInProject,
    tx?: TransactionContext,
  ): Promise<ProjectConfigRepoRes.getRuleGroupInProject | null>

  abstract getRuleInProject(
    cmd: ProjectConfigRepoCmd.getRuleInProject,
    tx?: TransactionContext,
  ): Promise<ProjectConfigRepoRes.getRuleInProject | null>

  abstract upsertRuleGroupConfig(
    cmd: ProjectConfigRepoCmd.upsertRuleGroupConfig,
    tx?: TransactionContext,
  ): Promise<ProjectConfigRepoRes.upsertRuleGroupConfig>

  abstract upsertRuleConfig(
    cmd: ProjectConfigRepoCmd.upsertRuleConfig,
    tx?: TransactionContext,
  ): Promise<ProjectConfigRepoRes.upsertRuleConfig>
}
