import { Controller, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  BRAND_SERVICE_PORT,
  type BrandServicePort,
} from '~/modules/brand/ports/brand.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Brand)
@Controller({
  path: 'brands',
  version: '1',
})
export class BrandController {
  constructor(
    @Inject(BRAND_SERVICE_PORT)
    private readonly brandService: BrandServicePort,
  ) {}
}
