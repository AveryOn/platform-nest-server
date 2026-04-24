import type { ResolvedRulesetRawData } from '~/modules/resolved-ruleset/application/resolved-ruleset.type'

export const RESOLVED_RULESET_REPO_PORT = Symbol(
  'RESOLVED_RULESET_REPO_PORT',
)

export abstract class ResolvedRulesetRepoPort {
  abstract getProjectResolvedRulesetData(
    projectId: string,
  ): Promise<ResolvedRulesetRawData>
}
