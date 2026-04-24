import type {
  ResolvedRulesetCmd,
  ResolvedRulesetRes,
} from '~/modules/resolved-ruleset/application/resolved-ruleset.type'

export const RESOLVED_RULESET_SERVICE_PORT = Symbol(
  'RESOLVED_RULESET_SERVICE_PORT',
)

export abstract class ResolvedRulesetServicePort {
  abstract getResolvedRuleset(
    cmd: ResolvedRulesetCmd.Get,
  ): Promise<ResolvedRulesetRes.Get>
}
