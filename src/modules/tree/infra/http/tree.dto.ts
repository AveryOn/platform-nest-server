import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator'

class RuleGroupNodeGroupDto {
  @ApiProperty({ example: 'group_01', description: 'Group ID' })
  @IsString()
  id: string

  @ApiProperty({ example: 'proj_01', description: 'Project ID' })
  @IsString()
  projectId: string

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  parentGroupId: string | null

  @ApiProperty({ example: 'Buttons' })
  @IsString()
  name: string

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  description: string | null

  @ApiProperty({ example: 'component' })
  @IsString()
  kind: string

  @ApiProperty({ example: {}, type: Object })
  metadata: unknown

  @ApiProperty({ example: 0 })
  @IsInt()
  orderIndex: number

  @ApiProperty({ example: false })
  @IsBoolean()
  isFromTemplate: boolean

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  templateRef: string | null

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  @IsDateString()
  createdAt: string

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  @IsDateString()
  updatedAt: string

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsDateString()
  deletedAt: string | null
}

class RuleGroupNodeRuleDto {
  @ApiProperty({ example: 'rule_01' })
  @IsString()
  id: string

  @ApiProperty({ example: 'proj_01' })
  @IsString()
  projectId: string

  @ApiProperty({ example: 'group_01' })
  @IsString()
  groupId: string

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  title: string | null

  @ApiProperty({ example: 'Rule body' })
  @IsString()
  body: string

  @ApiProperty({ example: {}, type: Object })
  metadata: unknown

  @ApiProperty({ example: 0 })
  @IsInt()
  orderIndex: number

  @ApiProperty({ example: false })
  @IsBoolean()
  isFromTemplate: boolean

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  templateRef: string | null

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  @IsDateString()
  createdAt: string

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  @IsDateString()
  updatedAt: string

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsDateString()
  deletedAt: string | null
}

export class GetProjectTreeResponse {
  @ApiProperty({ type: RuleGroupNodeGroupDto })
  group: RuleGroupNodeGroupDto

  @ApiProperty({ type: [RuleGroupNodeRuleDto] })
  @IsArray()
  rules: RuleGroupNodeRuleDto[]

  @ApiProperty({ type: () => [Object] })
  @IsArray()
  children: GetProjectTreeResponse[]
}
