import { Inject, Injectable } from "@nestjs/common"
import { TreeServicePort } from "~/modules/tree/ports/tree.service.port"
import { TREE_REPO_PORT, type TreeRepoPort } from "~/modules/tree/ports/tree.repo.port"


@Injectable()
export class TreeService implements TreeServicePort {
  constructor (
    @Inject(TREE_REPO_PORT)
    private readonly treeRepo: TreeRepoPort,
  ) {}

}