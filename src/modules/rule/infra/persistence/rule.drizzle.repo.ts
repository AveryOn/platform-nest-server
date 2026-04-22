import { Injectable } from '@nestjs/common'

import { RuleEntity, RuleServiceCmd } from '~/modules/rule/application/rule.type'
import { RuleRepoPort } from '~/modules/rule/ports/rule.repo.port'

@Injectable()
export class RuleDrizzleRepo implements RuleRepoPort {
  async create(_cmd: RuleServiceCmd.Create): Promise<RuleEntity> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async getByIdOrFail(_ruleId: string): Promise<RuleEntity> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async patch(_cmd: RuleServiceCmd.Patch): Promise<void> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async move(_cmd: RuleServiceCmd.Move): Promise<void> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async reorderInGroup(_cmd: RuleServiceCmd.ReorderInGroup): Promise<void> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }

  async remove(_ruleId: string): Promise<Date> {
    await Promise.resolve()
    throw new Error('Not implemented')
  }
}
