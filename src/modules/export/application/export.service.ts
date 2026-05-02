import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common'
import {
  ExportFormat,
  type ExportServiceCmd,
  type ExportServiceRes,
} from '~/modules/export/application/export.type'
import type { ExportServicePort } from '~/modules/export/ports/export.service.port'
import {
  PROJECT_REPO_PORT,
  type ProjectRepoPort,
} from '~/modules/project/ports/project.repo.port'
import {
  RESOLVED_RULESET_SERVICE_PORT,
  type ResolvedRulesetServicePort,
} from '~/modules/resolved-ruleset/ports/resolved-ruleset.service.port'
import {
  SNAPSHOT_SERVICE_PORT,
  type SnapshotServicePort,
} from '~/modules/snapshot/ports/snapshot.service.port'

@Injectable()
export class ExportService implements ExportServicePort {
  constructor(
    @Inject(PROJECT_REPO_PORT)
    private readonly projectRepo: ProjectRepoPort,

    @Inject(RESOLVED_RULESET_SERVICE_PORT)
    private readonly resolvedRulesetService: ResolvedRulesetServicePort,

    @Inject(SNAPSHOT_SERVICE_PORT)
    private readonly snapshotService: SnapshotServicePort,
  ) {}

  async export(
    cmd: ExportServiceCmd.Export,
  ): Promise<ExportServiceRes.Export> {
    await this.projectRepo.findProjectOrFail({
      projectId: cmd.projectId,
      organizationId: cmd.organizationId,
    })

    const resolvedRuleset =
      await this.resolvedRulesetService.getResolvedRuleset({
        projectId: cmd.projectId,
        includeMetadata: true,
      })

    const content = this.formatResolvedRuleset({
      format: cmd.format,
      resolvedRuleset,
    })

    if (cmd.createSnapshot === true) {
      const snapshot = await this.snapshotService.create({
        projectId: cmd.projectId,
        comment:
          'The ruleset was exported and the user requested a snapshot to be created',
        skipIfUnchanged: false,
      })
      if (snapshot) {
        return {
          projectId: cmd.projectId,
          format: cmd.format,
          content,
          snapshotId: snapshot.id,
          snapshotVersion: snapshot.version,
        }
      }
    }

    return {
      projectId: cmd.projectId,
      format: cmd.format,
      content,
    }
  }

  private formatResolvedRuleset(cmd: {
    format: ExportFormat
    resolvedRuleset: object
  }): string | object {
    switch (cmd.format) {
      case ExportFormat.json:
        return cmd.resolvedRuleset

      case ExportFormat.markdown:
        return this.toMarkdown(cmd.resolvedRuleset)

      default:
        throw new UnprocessableEntityException(
          'Unsupported export format',
        )
    }
  }

  private toMarkdown(resolvedRuleset: any): string {
    const rules = Array.isArray(resolvedRuleset.rules)
      ? resolvedRuleset.rules
      : []

    if (rules.length === 0) {
      return '# UI Rules\n\nNo active rules found.\n'
    }

    const lines: string[] = ['# UI Rules', '']

    for (const rule of rules) {
      if (rule.path?.length) {
        lines.push(`## ${rule.path.join(' / ')}`)
        lines.push('')
      }

      if (rule.name) {
        lines.push(`### ${rule.title}`)
        lines.push('')
      }

      if (rule.body) {
        lines.push(String(rule.body))
        lines.push('')
      }
    }

    return lines.join('\n')
  }
}
