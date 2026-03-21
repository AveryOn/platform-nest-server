import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class ExportRulesetResponse {
  @ApiProperty({
    example: 'rule_01HXYZABC123',
    description: 'Rule ID',
  })
  @IsString()
  id: string

  @ApiProperty({
    example: 'Button color',
    nullable: true,
    description: 'Rule title',
  })
  @IsOptional()
  @IsString()
  title: string | null

  @ApiProperty({
    example: 'Use primary color token',
    description: 'Rule body',
  })
  @IsString()
  body: string

  @ApiProperty({
    example: ['UI', 'Buttons'],
    type: [String],
    description: 'Path of groups',
  })
  @IsArray()
  @IsString({ each: true })
  path: string[]

  @ApiProperty({
    example: 'component',
    description: 'Group kind',
  })
  @IsString()
  groupKind: string

  @ApiProperty({
    example: { severity: 'high' },
    type: Object,
    description: 'Metadata',
  })
  metadata: unknown

  @ApiProperty({
    example: ['ui', 'button'],
    type: [String],
    description: 'Tags',
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @ApiProperty({
    example: 1,
    description: 'Global order index',
  })
  @IsInt()
  orderGlobal: number
}
