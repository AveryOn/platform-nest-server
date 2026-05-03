import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import type { OrgAuthReqPayload } from '~/modules/auth/application/auth.types'
import { OrgAuthReq } from '~/modules/auth/infra/http/auth-request.decorator'
import { SessionGuard } from '~/modules/auth/infra/session.guard'
import {
  BrandCreateDto,
  BrandItemRes,
} from '~/modules/brand/infra/http/brand.dto'
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

  @Post()
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create brand',
    description: 'Creates a new brand inside active organization context',
    operationId: 'create_brand',
    tags: [ApiSwaggerTag.Brand],
  })
  @ApiBody({
    type: BrandCreateDto,
    description: 'Payload for creating a brand',
    required: true,
  })
  @ApiDataResponse({
    type: BrandItemRes,
    status: HttpStatus.CREATED,
    description: 'Brand successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid request body',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. No rights to create brand in current organization',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict. Brand with same name already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  async createBrand(
    @Body()
    body: BrandCreateDto,

    @OrgAuthReq()
    auth: OrgAuthReqPayload,
  ): Promise<BrandItemRes> {
    return await this.brandService.create({
      organizationId: auth.activeOrganizationId,
      name: body.name,
    })
  }
}
