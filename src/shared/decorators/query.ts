import {
  BadRequestException,
  Query,
  type Type,
  ValidationPipe,
} from '@nestjs/common'

export const ValidQuery = <T extends Type<any>>(model: T) =>
  Query(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      expectedType: model,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: 'Validation failed',
          errors,
        })
      },
    }),
  )
