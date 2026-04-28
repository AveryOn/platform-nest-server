import type {
  ProjectConfigReqCmd,
  ProjectConfigRes,
} from '~/modules/project-config/application/project-config.type'

export const PROJECT_CONFIG_SERVICE_PORT = Symbol(
  'PROJECT_CONFIG_SERVICE_PORT',
)

export abstract class ProjectConfigServicePort {
  abstract updateRuleGroupConfig(
    cmd: ProjectConfigReqCmd.updateRuleGroupConfig,
  ): Promise<ProjectConfigRes.updateRuleGroupConfig>

  abstract updateRuleConfig(
    cmd: ProjectConfigReqCmd.updateRuleConfig,
  ): Promise<ProjectConfigRes.updateRuleConfig>
}
