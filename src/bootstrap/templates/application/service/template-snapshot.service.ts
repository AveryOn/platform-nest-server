import { Inject, Injectable } from '@nestjs/common'

import { buildTemplateSnapshotPayload } from '~/bootstrap/templates/application/scripts/build-template-snapshot.script'
import type {
  TemplateBase,
  TemplateSeedApplyResult,
  TemplateSeedCheckApplyResult,
  TemplateSeedCheckResult,
  TemplateSeedDiff,
  TemplateSeedDiffApplyResult,
  TemplateSeedDiffItem,
  TemplateSeedDryRunApplyResult,
  TemplateSeedDryRunResult,
  TemplateSeedResult,
  TemplateSnapshotGroup,
  TemplateSnapshotPayload,
  TemplateSnapshotRule,
} from '~/bootstrap/templates/application/service/template.types'
import {
  TEMPLATE_REGISTRY_SERVICE_PORT,
  type TemplateRegistryServicePort,
} from '~/bootstrap/templates/ports/template-registry.service.port'
import {
  TEMPLATE_SNAPSHOT_REPO_PORT,
  type TemplateSnapshotRepoPort,
} from '~/bootstrap/templates/ports/template-snapshot.repo.port'
import type { TemplateSnapshotServicePort } from '~/bootstrap/templates/ports/template-snapshot.service.port'
import {
  TEMPLATE_REPO_PORT,
  type TemplateRepoPort,
} from '~/bootstrap/templates/ports/template.repo.port'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import {
  TX_PORT,
  type TransactionPort,
} from '~/infra/transaction/ports/transaction.port'
import { RuleGroupType } from '~/modules/rule-group/application/rule-group.type'
import { buildSnapshotHash } from '~/shared/crypto/hash.crypto'

@Injectable()
export class TemplateSnapshotService implements TemplateSnapshotServicePort {
  constructor(
    @Inject(TX_PORT)
    private readonly transaction: TransactionPort<TransactionContext>,

    @Inject(TEMPLATE_REGISTRY_SERVICE_PORT)
    private readonly templateRegistry: TemplateRegistryServicePort,

    @Inject(TEMPLATE_REPO_PORT)
    private readonly templateRepo: TemplateRepoPort,

    @Inject(TEMPLATE_SNAPSHOT_REPO_PORT)
    private readonly templateSnapshotRepo: TemplateSnapshotRepoPort,
  ) {}

  async applyTemplates(): Promise<TemplateSeedApplyResult> {
    const sources = this.templateRegistry.getTemplates()

    const results = await this.transaction.run(async (tx) => {
      const applied: TemplateSeedResult[] = []

      for (const source of sources) {
        const payload = this.buildPayload(source)
        const hash = buildSnapshotHash(payload)

        let template = await this.templateRepo.findBySlug(
          payload.template.slug,
          tx,
        )

        if (!template) {
          template = await this.templateRepo.create(
            {
              slug: payload.template.slug,
              name: payload.template.name,
              description: payload.template.description,
            },
            tx,
          )
        } else if (
          template.name !== payload.template.name ||
          template.description !== payload.template.description
        ) {
          template = await this.templateRepo.updateMeta(
            {
              id: template.id,
              name: payload.template.name,
              description: payload.template.description,
            },
            tx,
          )
        }

        const latest =
          await this.templateSnapshotRepo.findLatestByTemplateId(
            template.id,
            tx,
          )

        if (latest?.hash === hash) {
          applied.push({
            slug: template.slug,
            status: 'skipped',
            templateId: template.id,
            snapshotId: latest.id,
            version: latest.version,
            hash,
          })

          continue
        }

        const snapshot = await this.templateSnapshotRepo.create(
          {
            templateId: template.id,
            version: latest ? latest.version + 1 : 1,
            payload,
            hash,
          },
          tx,
        )

        applied.push({
          slug: template.slug,
          status: latest ? 'updated' : 'created',
          templateId: template.id,
          snapshotId: snapshot.id,
          version: snapshot.version,
          hash,
        })
      }

      return applied
    })

    return { results }
  }

  async checkTemplates(): Promise<TemplateSeedCheckApplyResult> {
    const sources = this.templateRegistry.getTemplates()

    const results = await this.transaction.run(async (tx) => {
      const checked: TemplateSeedCheckResult[] = []

      for (const source of sources) {
        const payload = this.buildPayload(source)
        const sourceHash = buildSnapshotHash(payload)

        const template = await this.templateRepo.findBySlug(
          payload.template.slug,
          tx,
        )

        if (!template) {
          checked.push({
            slug: payload.template.slug,
            status: 'missing',
            sourceHash,
          })

          continue
        }

        const latest =
          await this.templateSnapshotRepo.findLatestByTemplateId(
            template.id,
            tx,
          )

        if (!latest) {
          checked.push({
            slug: template.slug,
            status: 'missing',
            templateId: template.id,
            sourceHash,
          })

          continue
        }

        checked.push({
          slug: template.slug,
          status: latest.hash === sourceHash ? 'synced' : 'outdated',
          templateId: template.id,
          latestSnapshotId: latest.id,
          latestVersion: latest.version,
          sourceHash,
          latestHash: latest.hash,
        })
      }

      return checked
    })

    return { results }
  }

  async dryRunTemplates(): Promise<TemplateSeedDryRunApplyResult> {
    const sources = this.templateRegistry.getTemplates()

    const results = await this.transaction.run(async (tx) => {
      const dryRun: TemplateSeedDryRunResult[] = []

      for (const source of sources) {
        const payload = this.buildPayload(source)
        const hash = buildSnapshotHash(payload)

        const template = await this.templateRepo.findBySlug(
          payload.template.slug,
          tx,
        )

        if (!template) {
          dryRun.push({
            slug: payload.template.slug,
            status: 'would-create',
            nextVersion: 1,
            hash,
          })

          continue
        }

        const latest =
          await this.templateSnapshotRepo.findLatestByTemplateId(
            template.id,
            tx,
          )

        if (latest?.hash === hash) {
          dryRun.push({
            slug: template.slug,
            status: 'would-skip',
            templateId: template.id,
            latestSnapshotId: latest.id,
            nextVersion: latest.version,
            hash,
          })

          continue
        }

        dryRun.push({
          slug: template.slug,
          status: 'would-update',
          templateId: template.id,
          latestSnapshotId: latest?.id,
          nextVersion: latest ? latest.version + 1 : 1,
          hash,
        })
      }

      return dryRun
    })

    return { results }
  }

  async diffTemplates(): Promise<TemplateSeedDiffApplyResult> {
    const sources = this.templateRegistry.getTemplates()

    const results = await this.transaction.run(async (tx) => {
      const diffs: TemplateSeedDiff[] = []

      for (const source of sources) {
        const payload = this.buildPayload(source)

        const template = await this.templateRepo.findBySlug(
          payload.template.slug,
          tx,
        )

        if (!template) {
          diffs.push({
            slug: payload.template.slug,
            added: this.collectPayloadItems(payload),
            removed: [],
            changed: [],
          })

          continue
        }

        const latest =
          await this.templateSnapshotRepo.findLatestByTemplateId(
            template.id,
            tx,
          )

        if (!latest) {
          diffs.push({
            slug: template.slug,
            added: this.collectPayloadItems(payload),
            removed: [],
            changed: [],
          })

          continue
        }

        diffs.push(this.buildDiff(latest.payload, payload))
      }

      return diffs
    })

    return { results }
  }

  buildPayload(source: TemplateBase): TemplateSnapshotPayload {
    const payload = buildTemplateSnapshotPayload(source)

    this.validateSourceTemplate(source)
    this.validateSnapshotPayload(payload)

    return payload
  }

  private validateSourceTemplate(source: TemplateBase): void {
    if (!source.slug?.trim()) {
      throw new Error('Template slug is required')
    }

    if (!source.name?.trim()) {
      throw new Error(`Template "${source.slug}" name is required`)
    }

    if (!Array.isArray(source.groups)) {
      throw new Error(`Template "${source.slug}" groups must be an array`)
    }
  }

  private validateSnapshotPayload(
    payload: TemplateSnapshotPayload,
  ): void {
    if (payload.schemaVersion !== 1) {
      throw new Error(
        `Unsupported template payload schema version: ${String(
          payload.schemaVersion,
        )}`,
      )
    }

    if (!payload.template.slug) {
      throw new Error('Template payload slug is required')
    }

    if (!payload.template.name) {
      throw new Error(
        `Template "${payload.template.slug}" name is required`,
      )
    }

    const groupKeys = new Set<string>()
    const ruleKeys = new Set<string>()

    this.validateGroupLevel({
      templateSlug: payload.template.slug,
      groups: payload.groups,
      path: [],
      groupKeys,
      ruleKeys,
    })
  }

  private validateGroupLevel(cmd: {
    templateSlug: string
    groups: TemplateSnapshotGroup[]
    path: string[]
    groupKeys: Set<string>
    ruleKeys: Set<string>
  }): void {
    const orderIndexes = new Set<number>()
    const allowedTypes = new Set<string>(Object.values(RuleGroupType))

    for (const group of cmd.groups) {
      const groupPath = [...cmd.path, group.key]

      if (!group.key) {
        throw new Error(
          `Template "${cmd.templateSlug}" has group with empty key at "${cmd.path.join('/')}"`,
        )
      }

      if (cmd.groupKeys.has(group.key)) {
        throw new Error(
          `Template "${cmd.templateSlug}" has duplicated group key "${group.key}"`,
        )
      }

      cmd.groupKeys.add(group.key)

      if (!group.name) {
        throw new Error(
          `Template "${cmd.templateSlug}" group "${group.key}" name is required`,
        )
      }

      if (!group.type) {
        throw new Error(
          `Template "${cmd.templateSlug}" group "${group.key}" type is required`,
        )
      }

      if (!allowedTypes.has(group.type)) {
        throw new Error(
          `Template "${cmd.templateSlug}" group "${group.key}" has invalid type "${group.type}"`,
        )
      }

      if (!Number.isInteger(group.orderIndex)) {
        throw new Error(
          `Template "${cmd.templateSlug}" group "${group.key}" orderIndex must be integer`,
        )
      }

      if (group.orderIndex < 0) {
        throw new Error(
          `Template "${cmd.templateSlug}" group "${group.key}" orderIndex must be >= 0`,
        )
      }

      if (orderIndexes.has(group.orderIndex)) {
        throw new Error(
          `Template "${cmd.templateSlug}" has duplicated group orderIndex "${group.orderIndex}" at "${cmd.path.join('/') || 'root'}"`,
        )
      }

      orderIndexes.add(group.orderIndex)

      this.validateJsonSerializable(group.metadata, {
        templateSlug: cmd.templateSlug,
        entity: 'group',
        key: group.key,
        field: 'metadata',
      })

      this.validateRuleLevel({
        templateSlug: cmd.templateSlug,
        rules: group.rules,
        path: groupPath,
        ruleKeys: cmd.ruleKeys,
      })

      this.validateGroupLevel({
        templateSlug: cmd.templateSlug,
        groups: group.children,
        path: groupPath,
        groupKeys: cmd.groupKeys,
        ruleKeys: cmd.ruleKeys,
      })
    }
  }

  private validateRuleLevel(cmd: {
    templateSlug: string
    rules: TemplateSnapshotRule[]
    path: string[]
    ruleKeys: Set<string>
  }): void {
    const orderIndexes = new Set<number>()

    for (const rule of cmd.rules) {
      if (!rule.key) {
        throw new Error(
          `Template "${cmd.templateSlug}" has rule with empty key at "${cmd.path.join('/')}"`,
        )
      }

      if (cmd.ruleKeys.has(rule.key)) {
        throw new Error(
          `Template "${cmd.templateSlug}" has duplicated rule key "${rule.key}"`,
        )
      }

      cmd.ruleKeys.add(rule.key)

      if (!rule.name) {
        throw new Error(
          `Template "${cmd.templateSlug}" rule "${rule.key}" name is required`,
        )
      }

      if (!rule.body) {
        throw new Error(
          `Template "${cmd.templateSlug}" rule "${rule.key}" body is required`,
        )
      }

      if (!Number.isInteger(rule.orderIndex)) {
        throw new Error(
          `Template "${cmd.templateSlug}" rule "${rule.key}" orderIndex must be integer`,
        )
      }

      if (rule.orderIndex < 0) {
        throw new Error(
          `Template "${cmd.templateSlug}" rule "${rule.key}" orderIndex must be >= 0`,
        )
      }

      if (orderIndexes.has(rule.orderIndex)) {
        throw new Error(
          `Template "${cmd.templateSlug}" has duplicated rule orderIndex "${rule.orderIndex}" at "${cmd.path.join('/')}"`,
        )
      }

      orderIndexes.add(rule.orderIndex)

      this.validateJsonSerializable(rule.metadata, {
        templateSlug: cmd.templateSlug,
        entity: 'rule',
        key: rule.key,
        field: 'metadata',
      })
    }
  }

  private validateJsonSerializable(
    value: unknown,
    cmd: {
      templateSlug: string
      entity: 'group' | 'rule'
      key: string
      field: string
    },
  ): void {
    try {
      JSON.stringify(value)
    } catch {
      throw new Error(
        `Template "${cmd.templateSlug}" ${cmd.entity} "${cmd.key}" has non-serializable ${cmd.field}`,
      )
    }
  }

  private buildDiff(
    previous: TemplateSnapshotPayload,
    next: TemplateSnapshotPayload,
  ): TemplateSeedDiff {
    const previousItems = this.collectPayloadItemMap(previous)
    const nextItems = this.collectPayloadItemMap(next)

    const added: TemplateSeedDiffItem[] = []
    const removed: TemplateSeedDiffItem[] = []
    const changed: TemplateSeedDiffItem[] = []

    for (const [key, item] of nextItems.entries()) {
      const prev = previousItems.get(key)

      if (!prev) {
        added.push(item.meta)
        continue
      }

      if (
        buildSnapshotHash(prev.value) !== buildSnapshotHash(item.value)
      ) {
        changed.push(item.meta)
      }
    }

    for (const [key, item] of previousItems.entries()) {
      if (!nextItems.has(key)) {
        removed.push(item.meta)
      }
    }

    return {
      slug: next.template.slug,
      added,
      removed,
      changed,
    }
  }

  private collectPayloadItems(
    payload: TemplateSnapshotPayload,
  ): TemplateSeedDiffItem[] {
    return [...this.collectPayloadItemMap(payload).values()].map(
      (item) => item.meta,
    )
  }

  private collectPayloadItemMap(payload: TemplateSnapshotPayload) {
    const items = new Map<
      string,
      {
        meta: TemplateSeedDiffItem
        value: unknown
      }
    >()

    items.set('template', {
      meta: {
        path: payload.template.slug,
        type: 'template',
        key: payload.template.slug,
      },
      value: payload.template,
    })

    for (const group of payload.groups) {
      this.collectGroupItems({
        items,
        group,
        path: [],
      })
    }

    return items
  }

  private collectGroupItems(cmd: {
    items: Map<string, { meta: TemplateSeedDiffItem; value: unknown }>
    group: TemplateSnapshotGroup
    path: string[]
  }): void {
    const path = [...cmd.path, cmd.group.key]
    const pathString = path.join('/')

    cmd.items.set(`group:${cmd.group.key}`, {
      meta: {
        path: pathString,
        type: 'group',
        key: cmd.group.key,
      },
      value: {
        key: cmd.group.key,
        name: cmd.group.name,
        description: cmd.group.description,
        type: cmd.group.type,
        orderIndex: cmd.group.orderIndex,
        metadata: cmd.group.metadata,
      },
    })

    for (const rule of cmd.group.rules) {
      cmd.items.set(`rule:${rule.key}`, {
        meta: {
          path: `${pathString}/${rule.key}`,
          type: 'rule',
          key: rule.key,
        },
        value: rule,
      })
    }

    for (const child of cmd.group.children) {
      this.collectGroupItems({
        items: cmd.items,
        group: child,
        path,
      })
    }
  }
}
