import { Test } from '@nestjs/testing'
import { RuleGroupType } from '~/infra/drizzle/schemas'
import type { TransactionContext } from '~/infra/transaction/application/transaction.type'
import { TX_PORT } from '~/infra/transaction/ports/transaction.port'
import { TreeService } from '~/modules/tree/application/tree.service'
import type {
  RuleTreeLeaf,
  RuleTreeNodeBase,
} from '~/modules/tree/application/tree.type'
import { TREE_REPO_PORT } from '~/modules/tree/ports/tree.repo.port'

describe('TreeService', () => {
  let service: TreeService

  const txMock = {} as TransactionContext

  const treeRepoMock = {
    getProjectRules: jest.fn(),
    getProjectRuleGroups: jest.fn(),
  }

  const transactionMock = {
    run: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    transactionMock.run.mockImplementation((handler) => {
      return handler(txMock)
    })

    const moduleRef = await Test.createTestingModule({
      providers: [
        TreeService,
        {
          provide: TREE_REPO_PORT,
          useValue: treeRepoMock,
        },
        {
          provide: TX_PORT,
          useValue: transactionMock,
        },
      ],
    }).compile()

    service = moduleRef.get(TreeService)
  })

  it('should build editor tree from flat groups and rules', async () => {
    const projectId = 'project-1'

    const groups: RuleTreeNodeBase[] = [
      makeGroup({
        id: 'button-group',
        projectId,
        parentGroupId: 'components-root',
        name: 'Button',
        orderIndex: 2,
      }),
      makeGroup({
        id: 'input-group',
        projectId,
        parentGroupId: 'components-root',
        name: 'Input',
        orderIndex: 1,
      }),
      makeGroup({
        id: 'components-root',
        projectId,
        parentGroupId: null,
        name: 'Components',
        orderIndex: 2,
      }),
      makeGroup({
        id: 'styles-root',
        projectId,
        parentGroupId: null,
        name: 'Styles',
        orderIndex: 1,
      }),
    ]

    const rules: RuleTreeLeaf[] = [
      makeRule({
        id: 'button-rule-2',
        ruleGroupId: 'button-group',
        name: 'Accessibility',
        orderIndex: 2,
      }),
      makeRule({
        id: 'button-rule-1',
        ruleGroupId: 'button-group',
        name: 'When to use',
        orderIndex: 1,
      }),
      makeRule({
        id: 'input-rule-1',
        ruleGroupId: 'input-group',
        name: 'Input usage',
        orderIndex: 1,
      }),
    ]

    treeRepoMock.getProjectRules.mockResolvedValue(rules)
    treeRepoMock.getProjectRuleGroups.mockResolvedValue(groups)

    const result = await service.getEditorTree({
      projectId,
      includeHidden: false,
      includeMetadata: true,
    })

    expect(transactionMock.run).toHaveBeenCalledTimes(1)

    expect(treeRepoMock.getProjectRules).toHaveBeenCalledWith(
      projectId,
      txMock,
    )

    expect(treeRepoMock.getProjectRuleGroups).toHaveBeenCalledWith(
      projectId,
      txMock,
    )

    expect(result).toEqual({
      projectId,
      includeHidden: false,
      includeMetadata: true,
      tree: [
        expect.objectContaining({
          id: 'styles-root',
          name: 'Styles',
          rules: [],
          children: [],
        }),
        expect.objectContaining({
          id: 'components-root',
          name: 'Components',
          rules: [],
          children: [
            expect.objectContaining({
              id: 'input-group',
              name: 'Input',
              rules: [
                expect.objectContaining({
                  id: 'input-rule-1',
                  name: 'Input usage',
                }),
              ],
              children: [],
            }),
            expect.objectContaining({
              id: 'button-group',
              name: 'Button',
              rules: [
                expect.objectContaining({
                  id: 'button-rule-1',
                  name: 'When to use',
                }),
                expect.objectContaining({
                  id: 'button-rule-2',
                  name: 'Accessibility',
                }),
              ],
              children: [],
            }),
          ],
        }),
      ],
    })
  })

  it('should use default includeHidden and includeMetadata values', async () => {
    const projectId = 'project-1'

    treeRepoMock.getProjectRules.mockResolvedValue([])
    treeRepoMock.getProjectRuleGroups.mockResolvedValue([])

    const result = await service.getEditorTree({ projectId })

    expect(result).toEqual({
      projectId,
      includeHidden: true,
      includeMetadata: true,
      tree: [],
    })
  })

  it('should return empty tree when project has no groups', async () => {
    const projectId = 'project-1'

    treeRepoMock.getProjectRules.mockResolvedValue([
      makeRule({
        id: 'orphan-rule',
        ruleGroupId: 'missing-group',
        name: 'Orphan rule',
        orderIndex: 1,
      }),
    ])

    treeRepoMock.getProjectRuleGroups.mockResolvedValue([])

    const result = await service.getEditorTree({ projectId })

    expect(result.tree).toEqual([])
  })
})

function makeGroup(
  override: Partial<RuleTreeNodeBase>,
): RuleTreeNodeBase {
  return {
    id: 'group-id',
    projectId: 'project-id',
    parentGroupId: null,
    name: 'Group',
    description: null,
    type: RuleGroupType.category,
    orderIndex: 0,
    isHidden: false,
    createdAt: '2026-04-20T12:00:00.000Z',
    updatedAt: '2026-04-20T12:30:00.000Z',
    ...override,
  }
}

function makeRule(override: Partial<RuleTreeLeaf>): RuleTreeLeaf {
  return {
    id: 'rule-id',
    ruleGroupId: 'group-id',
    name: 'Rule',
    body: 'Rule body',
    metadata: null,
    orderIndex: 0,
    isHidden: false,
    createdAt: '2026-04-20T12:00:00.000Z',
    updatedAt: '2026-04-20T12:30:00.000Z',
    ...override,
  }
}
