import { Inject, Injectable } from '@nestjs/common'

import { buildTemplateSnapshotPayload } from '~/bootstrap/templates/application/scripts/build-template-snapshot.script'
import type {
  TemplateBase,
  TemplateSeedApplyResult,
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
        const payload = buildTemplateSnapshotPayload(source)

        this.validateSourceTemplate(source)
        this.validateSnapshotPayload(payload)

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

    return {
      results,
    }
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

      if (!Number.isInteger(group.orderIndex)) {
        throw new Error(
          `Template "${cmd.templateSlug}" group "${group.key}" orderIndex must be integer`,
        )
      }

      if (orderIndexes.has(group.orderIndex)) {
        throw new Error(
          `Template "${cmd.templateSlug}" has duplicated group orderIndex "${group.orderIndex}" at "${cmd.path.join('/') || 'root'}"`,
        )
      }

      orderIndexes.add(group.orderIndex)

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

      if (orderIndexes.has(rule.orderIndex)) {
        throw new Error(
          `Template "${cmd.templateSlug}" has duplicated rule orderIndex "${rule.orderIndex}" at "${cmd.path.join('/')}"`,
        )
      }

      orderIndexes.add(rule.orderIndex)
    }
  }
}
