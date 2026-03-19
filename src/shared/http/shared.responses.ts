import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class OperationSuccessResponse {
  @ApiProperty({ example: 'success', description: 'Status of request' })
  @IsString()
  @IsNotEmpty()
  status: 'success'
}

export class OperationFailedResponse {
  @ApiProperty({ example: 'failed', description: 'Status of request' })
  @IsString()
  @IsNotEmpty()
  status: 'failed'
}
