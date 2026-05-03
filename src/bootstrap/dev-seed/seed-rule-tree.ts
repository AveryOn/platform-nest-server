import { ruleGroupsTable, rulesTable } from '~/infra/drizzle/schemas'
import { DEV_SEED } from './dev-seed.const'

export async function seedRuleTree(db: any) {
  await db
    .insert(ruleGroupsTable)
    .values([
      {
        id: DEV_SEED.ruleGroups.components,
        projectId: DEV_SEED.projects.projectA.id,
        parentGroupId: null,
        scope: 'project',
        name: 'Components',
        description: 'Component rules',
        orderIndex: 0,
        type: 'category',
        metadata: {},
      },
      {
        id: DEV_SEED.ruleGroups.button,
        projectId: DEV_SEED.projects.projectA.id,
        parentGroupId: DEV_SEED.ruleGroups.components,
        scope: 'project',
        name: 'Button',
        description: 'Button component rules',
        orderIndex: 0,
        type: 'component',
        metadata: {},
      },
      {
        id: DEV_SEED.ruleGroups.buttonWhenToUse,
        projectId: DEV_SEED.projects.projectA.id,
        parentGroupId: DEV_SEED.ruleGroups.button,
        scope: 'project',
        name: 'When to use',
        description: 'Button usage rules',
        orderIndex: 0,
        type: 'section',
        metadata: {},
      },
      {
        id: DEV_SEED.ruleGroups.buttonAccessibility,
        projectId: DEV_SEED.projects.projectA.id,
        parentGroupId: DEV_SEED.ruleGroups.button,
        scope: 'project',
        name: 'Accessibility',
        description: 'Button accessibility rules',
        orderIndex: 1,
        type: 'section',
        metadata: {},
      },
      {
        id: DEV_SEED.ruleGroups.styles,
        projectId: DEV_SEED.projects.projectA.id,
        parentGroupId: null,
        scope: 'project',
        name: 'Styles',
        description: 'Style rules',
        orderIndex: 1,
        type: 'category',
        metadata: {},
      },
      {
        id: DEV_SEED.ruleGroups.colors,
        projectId: DEV_SEED.projects.projectA.id,
        parentGroupId: DEV_SEED.ruleGroups.styles,
        scope: 'project',
        name: 'Colors',
        description: 'Color rules',
        orderIndex: 0,
        type: 'token',
        metadata: {},
      },
    ])
    .onConflictDoNothing()

  await db
    .insert(rulesTable)
    .values([
      {
        id: DEV_SEED.rules.buttonPrimary,
        projectId: DEV_SEED.projects.projectA.id,
        ruleGroupId: DEV_SEED.ruleGroups.buttonWhenToUse,
        scope: 'project',
        orderIndex: 0,
        name: 'Use primary button for main action',
        description: null,
        metadata: {},
        body: 'Use the primary button only for the main action on the screen.',
      },
      {
        id: DEV_SEED.rules.buttonLink,
        projectId: DEV_SEED.projects.projectA.id,
        ruleGroupId: DEV_SEED.ruleGroups.buttonWhenToUse,
        scope: 'project',
        orderIndex: 1,
        name: 'Use link for navigation',
        description: null,
        metadata: {},
        body: 'Use a link instead of a button when the action navigates to another page.',
      },
      {
        id: DEV_SEED.rules.buttonA11y,
        projectId: DEV_SEED.projects.projectA.id,
        ruleGroupId: DEV_SEED.ruleGroups.buttonAccessibility,
        scope: 'project',
        orderIndex: 0,
        name: 'Button must have accessible label',
        description: null,
        metadata: {},
        body: 'Icon-only buttons must include an accessible label.',
      },
      {
        id: DEV_SEED.rules.colorContrast,
        projectId: DEV_SEED.projects.projectA.id,
        ruleGroupId: DEV_SEED.ruleGroups.colors,
        scope: 'project',
        orderIndex: 0,
        name: 'Text contrast must be readable',
        description: null,
        metadata: {},
        body: 'Text color must have enough contrast against the background.',
      },
    ])
    .onConflictDoNothing()
}
