import { Module } from '@nestjs/common'
import { ApiKeyModule } from '~/modules/api-key/api-key.module'
import { AuthModule } from '~/modules/auth/auth.module'
import { ResolvedRulesetService } from '~/modules/resolved-ruleset/application/resolved-ruleset.service'
import { ResolvedRulesetController } from '~/modules/resolved-ruleset/infra/http/resolved-ruleset.controller'
import { ResolvedRulesetDrizzleRepo } from '~/modules/resolved-ruleset/infra/persistence/resolved-ruleset.drizzle.repo'
import { RESOLVED_RULESET_REPO_PORT } from '~/modules/resolved-ruleset/ports/resolved-ruleset.repo.port'
import { RESOLVED_RULESET_SERVICE_PORT } from '~/modules/resolved-ruleset/ports/resolved-ruleset.service.port'

@Module({
  controllers: [ResolvedRulesetController],
  imports: [AuthModule, ApiKeyModule],
  providers: [
    {
      provide: RESOLVED_RULESET_SERVICE_PORT,
      useClass: ResolvedRulesetService,
    },
    {
      provide: RESOLVED_RULESET_REPO_PORT,
      useClass: ResolvedRulesetDrizzleRepo,
    },
  ],
  exports: [RESOLVED_RULESET_SERVICE_PORT],
})
export class ResolvedRulesetModule {}
