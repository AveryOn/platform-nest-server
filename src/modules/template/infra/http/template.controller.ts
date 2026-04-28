import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import {
  TemplateGetListQueryDto,
  TemplateItemRes,
  TemplateSnapshotGetListQueryDto,
  TemplateSnapshotItemRes,
} from '~/modules/template/infra/http/template.dto'
import {
  TEMPLATE_SERVICE_PORT,
  type TemplateServicePort,
} from '~/modules/template/ports/template.service.port'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { ValidQuery } from '~/shared/decorators/query'
import type { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'
import { ApiPaginator } from '~/shared/paginator/infra/http/paginator.swagger.helper'

@ApiTags(ApiSwaggerTag.Template)
@Controller({
  path: 'templates',
  version: '1',
})
export class TemplateController {
  constructor(
    @Inject(TEMPLATE_SERVICE_PORT)
    private readonly templateService: TemplateServicePort,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get templates list',
    description: 'Returns the list of available read-only templates',
    operationId: 'get_templates_list',
    tags: [ApiSwaggerTag.Template],
  })
  @ApiPaginator({
    query: {
      type: TemplateGetListQueryDto,
    },
    response: {
      status: HttpStatus.OK,
      description: 'Templates list successfully returned',
      type: TemplateItemRes,
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  async getTemplates(
    @ValidQuery(TemplateGetListQueryDto)
    query: TemplateGetListQueryDto,
  ): Promise<PaginatedResponse<TemplateItemRes>> {
    return await this.templateService.getList({
      limit: query.limit,
      page: query.page,
    })
  }

  @Get(':templateId')
  @ApiOperation({
    summary: 'Get template by id',
    description: 'Returns template metadata by UUID',
    operationId: 'get_template_by_id',
    tags: [ApiSwaggerTag.Template],
  })
  @ApiParam({
    name: 'templateId',
    required: true,
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    type: String,
    format: 'uuid',
    description: 'Template UUID',
  })
  @ApiDataResponse({
    status: HttpStatus.OK,
    description: 'Template successfully returned',
    type: TemplateItemRes,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Template not found',
  })
  async getTemplateById(
    @Param('templateId', ParseUUIDPipe)
    templateId: string,
  ): Promise<TemplateItemRes> {
    return await this.templateService.getById({
      templateId,
    })
  }

  @Get(':templateId/snapshots')
  @ApiOperation({
    summary: 'Get template snapshots list',
    description:
      'Returns the list of immutable snapshots for the specified template',
    operationId: 'get_template_snapshots_list',
    tags: [ApiSwaggerTag.Template],
  })
  @ApiParam({
    name: 'templateId',
    required: true,
    example: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    type: String,
    format: 'uuid',
    description: 'Template UUID',
  })
  @ApiPaginator({
    query: {
      type: TemplateSnapshotGetListQueryDto,
    },
    response: {
      status: HttpStatus.OK,
      description: 'Template snapshots list successfully returned',
      type: TemplateSnapshotItemRes,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid UUID',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Template not found',
  })
  async getTemplateSnapshots(
    @Param('templateId', ParseUUIDPipe)
    templateId: string,

    @ValidQuery(TemplateSnapshotGetListQueryDto)
    query: TemplateSnapshotGetListQueryDto,
  ): Promise<PaginatedResponse<TemplateSnapshotItemRes>> {
    return await this.templateService.getSnapshotList({
      limit: query.limit,
      page: query.page,
      templateId,
    })
  }
}
