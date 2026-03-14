import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  SystemGetSampleQueryDto,
  SystemGetSampleResponse,
  SystemPatchSampleDto,
  SystemPatchSampleResponse,
  SystemPostSampleDto,
  SystemPostSampleResponse,
} from '~/modules/system/infra/http/system.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { AppLoggerService } from '~/core/logger/logger.service'
import { AppError, ERROR } from '~/core/error/app-error'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import { PAGINATOR_PORT, type PaginatorServicePort } from '~/shared/paginator/ports/paginator.service.port'

@ApiTags(ApiSwaggerTag.System)
@Controller({ path: 'system', version: '1' })
export class SystemController {
  constructor(
    private readonly logger: AppLoggerService,

    @Inject(PAGINATOR_PORT)
    private readonly paginator: PaginatorServicePort,
  ) {}

  @Get('ping')
  @ApiOperation({
    summary: 'Ping',
    description: 'Ping Route',
    operationId: 'system_ping',
    tags: [ApiSwaggerTag.System],
  })
  async ping() {
    this.logger.info('Example log INFO', { scope: 'SystemPing' })
    const num = Math.random()
    
    if(num > 0.4) {
      throw new AppError(ERROR.INVALID_DATA, this.logger).log('ping was wrong', { context: { num }, scope: 'SystemPing' })
    }

    const { skip, take } = this.paginator.config({ limit: 15, page: 1 })
    const paginator = this.paginator.response({ data: [], total: -1 })
    return { msg: 'ok', paginator }
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get system sample resource',
    description: 'This is fully description',
    operationId: 'get_system_resource_by_uuid',
  })
  @ApiParam({
    name: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
    type: String,
    format: 'uuid',
    description: 'Description',
  })
  @ApiDataResponse({
    type: SystemGetSampleResponse,
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or query parameters',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Resource not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  getSample(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Query() query: SystemGetSampleQueryDto,
  ): SystemGetSampleResponse {
    // console.debug('query', query)
    return {
      id: uuid,
      name: 'example',
      count: 10,
      enabled: true,
      items: ['first', 'second', 'third'],
      metadata: { key: 'example' },
    }
  }

  @Post(':uuid')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Post system sample resource',
    description: 'This is fully description',
    operationId: 'post_system_sample',
  })
  @ApiParam({
    name: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
    type: String,
    format: 'uuid',
    description: 'Description',
  })
  @ApiDataResponse({
    type: SystemPostSampleResponse,
    status: 201,
    description: 'Success',
  })
  @ApiCreatedResponse({
    type: SystemPostSampleDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or query parameters',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Resource not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  postSample(@Body() body: SystemPostSampleDto): SystemPostSampleResponse {
    return {
      id: crypto.randomUUID(),
      name: body.name,
      quantity: body.quantity,
      enabled: body.enabled,
      createdAt: new Date().toISOString(),
    }
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOperation({
    summary: 'Patch system sample resource',
    description: 'This is fully description',
    operationId: 'patch_system_sample',
  })
  @ApiDataResponse({
    description: 'Success',
    status: HttpStatus.OK,
    type: SystemPatchSampleResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID or query parameters',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Resource not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  patchSample(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SystemPatchSampleDto,
  ): SystemPatchSampleResponse {
    return {
      status: 'success',
    }
  }
}
