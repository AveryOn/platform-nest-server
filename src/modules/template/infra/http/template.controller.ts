import { Controller, Get, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  TemplateItemResponseDto,
  TemplateSnapshotsListResponseDto,
  TemplatesListResponseDto,
} from '~/modules/template/infra/http/template.dto'
import { ApiSwaggerTag } from '~/shared/const/app.const'

@ApiTags(ApiSwaggerTag.Template)
@Controller({ path: 'templates', version: '1' })
export class TemplateController {
  @Get()
  @ApiOperation({
    summary: 'Get templates list',
    description: 'Returns the list of available read-only templates',
    operationId: 'get_templates_list',
    tags: [ApiSwaggerTag.Template],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Templates list successfully returned',
    type: TemplatesListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. Missing or invalid authentication',
  })
  getTemplates(): TemplatesListResponseDto {
    return {
      total: 1,
      items: [
        {
          id: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
          slug: 'shadcn-ui',
          name: 'shadcn/ui',
          description: 'Default UI rules template based on shadcn/ui structure',
          createdAt: '2026-04-20T12:00:00.000Z',
          updatedAt: '2026-04-20T12:30:00.000Z',
        },
      ],
    }
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Template successfully returned',
    type: TemplateItemResponseDto,
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
  getTemplateById(@Param('templateId', ParseUUIDPipe) templateId: string): TemplateItemResponseDto {
    return {
      id: templateId,
      slug: 'shadcn-ui',
      name: 'shadcn/ui',
      description: 'Default UI rules template based on shadcn/ui structure',
      createdAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-20T12:30:00.000Z',
    }
  }

  @Get(':templateId/snapshots')
  @ApiOperation({
    summary: 'Get template snapshots list',
    description: 'Returns the list of immutable snapshots for the specified template',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Template snapshots list successfully returned',
    type: TemplateSnapshotsListResponseDto,
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
  getTemplateSnapshots(
    @Param('templateId', ParseUUIDPipe) templateId: string,
  ): TemplateSnapshotsListResponseDto {
    return {
      templateId,
      total: 1,
      items: [
        {
          id: '0d3fe3b9-a578-420e-9556-d316ece261d3',
          templateId,
          version: 1,
          hash: 'f8ac10f23c5b5bc1167bda84b833e5c057a77d2f2f5a9174709b4f0c2d7fcb45',
          createdAt: '2026-04-20T12:45:00.000Z',
        },
      ],
    }
  }
}
