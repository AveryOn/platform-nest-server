import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'
import { SWAGGER_EXAMPLES } from '~/shared/const/swagger.const'
import { SocialProvider } from '~/modules/auth/application/auth.types'

export class GetUserData {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.hash,
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  id: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.fullName,
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.email,
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    example: true,
    type: [Boolean],
  })
  @IsBoolean()
  @IsNotEmpty()
  emailVerified: boolean

  @ApiProperty({
    example: 'blob...',
    type: [String],
  })
  @IsString()
  image: string | null

  @ApiProperty({ example: SWAGGER_EXAMPLES.dateISO })
  @IsDate()
  createdAt: string

  @ApiProperty({ example: SWAGGER_EXAMPLES.dateISO })
  @IsDate()
  updatedAt: string
}
export class SignUpDto {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.fullName,
    description: 'Description',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.email,
    description: 'Description',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.password,
    description: 'Description',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.url,
    description: 'Description',
    type: [String],
  })
  @IsString()
  callbackURL?: string
}

export class SignUpResponse {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.hash,
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({ type: () => GetUserData })
  @ValidateNested()
  @Type(() => GetUserData)
  user: GetUserData
}

export class SignInDto {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.email,
    description: 'Description',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.password,
    description: 'Description',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.url,
    description: 'Description',
    type: [String],
  })
  @IsString()
  callbackURL?: string
}

export class SignInResponse {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.boolean,
    type: [Boolean],
  })
  @IsBoolean()
  @IsNotEmpty()
  redirect: boolean

  @ApiProperty({
    example: SWAGGER_EXAMPLES.hash,
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({ type: () => GetUserData })
  @ValidateNested()
  @Type(() => GetUserData)
  user: GetUserData
}

export class SignInSocialDto {
  @ApiProperty({
    example: SocialProvider.google,
    type: [String],
    enum: [SocialProvider.apple, SocialProvider.google],
  })
  @IsNotEmpty()
  @IsEnum([SocialProvider.apple, SocialProvider.google])
  @IsString()
  provider: keyof typeof SocialProvider

  @ApiProperty({
    example: SWAGGER_EXAMPLES.url,
    description: 'Description',
    type: [String],
  })
  @IsString()
  callbackURL?: string
}

export class SignInSocialResponse {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.url_2,
    description: 'Description',
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string

  @ApiProperty({
    example: SWAGGER_EXAMPLES.boolean,
    type: [Boolean],
  })
  @IsBoolean()
  @IsNotEmpty()
  redirect: boolean
}

export class EnsureOrganizationResponse {
  @ApiProperty({
    example: SWAGGER_EXAMPLES.hash,
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  orgId: string
}
