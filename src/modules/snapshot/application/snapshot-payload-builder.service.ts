import { Inject, Injectable } from '@nestjs/common'
import {
  RESOLVED_RULESET_SERVICE_PORT,
  type ResolvedRulesetServicePort,
} from '~/modules/resolved-ruleset/ports/resolved-ruleset.service.port'
import type {
  SnapshotPayload,
  SnapshotPayloadBuilderCmd,
} from '~/modules/snapshot/application/snapshot.type'
import type { SnapshotPayloadBuilderPort } from '~/modules/snapshot/ports/snapshot-payload-builder.port'

@Injectable()
export class SnapshotPayloadBuilder implements SnapshotPayloadBuilderPort {
  constructor(
    @Inject(RESOLVED_RULESET_SERVICE_PORT)
    private readonly resolvedRulesetService: ResolvedRulesetServicePort,
  ) {}

  async build(
    cmd: SnapshotPayloadBuilderCmd.Build,
  ): Promise<SnapshotPayload> {
    const resolved = await this.resolvedRulesetService.getResolvedRuleset(
      {
        projectId: cmd.projectId,
      },
    )

    return {
      rules: resolved.rules,
    }
  }
}
