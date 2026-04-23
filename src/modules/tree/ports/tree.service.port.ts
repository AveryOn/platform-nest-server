import type {
  TreeServiceCmd,
  TreeServiceResult,
} from '~/modules/tree/application/tree.type'

export const TREE_SERVICE_PORT = Symbol('TREE_SERVICE_PORT')

export abstract class TreeServicePort {
  abstract getEditorTree(
    cmd: TreeServiceCmd.GetTree,
  ): Promise<TreeServiceResult.GetTree>
}
