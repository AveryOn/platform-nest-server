import { NestFactory } from '@nestjs/core'

import { AppModule } from '~/app.module'
import { DRIZZLE_PORT } from '~/infra/drizzle/ports/drizzle.service.port'
import { DEV_SEED } from './dev-seed.const'
import { seedApiKeys } from './seed-api-keys'
import { seedAuth } from './seed-auth'
import { seedDomain } from './seed-domain'
import { seedProjectConfig } from './seed-project-config'
import { seedRuleTree } from './seed-rule-tree'

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  try {
    const drizzle = app.get(DRIZZLE_PORT)
    const db = drizzle.db

    await seedAuth(db)
    await seedDomain(db)
    await seedRuleTree(db)
    await seedProjectConfig(db)
    await seedApiKeys(db)

    console.log('Dev seed completed')
    console.log('')
    console.log('Users:')
    console.log('OWNER:', DEV_SEED.users.owner.email)
    console.log('MEMBER:', DEV_SEED.users.member.email)
    console.log('NO_MEMBER:', DEV_SEED.users.noMember.email)
    console.log('OTHER_ORG:', DEV_SEED.users.otherOrg.email)
    console.log('')
    console.log('Session tokens:')
    console.log('OWNER:', DEV_SEED.sessions.owner.token)
    console.log('MEMBER:', DEV_SEED.sessions.member.token)
    console.log('NO_MEMBER:', DEV_SEED.sessions.noMember.token)
    console.log('OTHER_ORG:', DEV_SEED.sessions.otherOrg.token)
    console.log('')
    console.log('API keys:')
    console.log('READ_ONLY:', DEV_SEED.apiKeys.readOnly.raw)
    console.log('WRITABLE:', DEV_SEED.apiKeys.writable.raw)
    console.log('REVOKED:', DEV_SEED.apiKeys.revoked.raw)
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  } finally {
    await app.close()
  }
}

void main()
