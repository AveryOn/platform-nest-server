import { Module } from '@nestjs/common'
import { AuthModule } from '~/modules/auth/auth.module'
import { BrandService } from '~/modules/brand/application/brand.service'
import { BrandController } from '~/modules/brand/infra/http/brand.controller'
import { BrandDrizzleRepo } from '~/modules/brand/infra/persistence/drizzle.brand.repo'
import { BRAND_REPO_PORT } from '~/modules/brand/ports/brand.repo.port'
import { BRAND_SERVICE_PORT } from '~/modules/brand/ports/brand.service.port'

@Module({
  controllers: [BrandController],
  imports: [AuthModule],
  providers: [
    {
      provide: BRAND_SERVICE_PORT,
      useClass: BrandService,
    },
    {
      provide: BRAND_REPO_PORT,
      useClass: BrandDrizzleRepo,
    },
  ],
  exports: [BRAND_SERVICE_PORT, BRAND_REPO_PORT],
})
export class BrandModule {}
