import helmet from 'helmet'
import express from 'express'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'

import { AppModule } from '~/app.module'
import { env } from '~/core/env'
import { AuthService } from '~/modules/auth/auth.service'
import { betterAuthExpressHandler } from '~/modules/auth/auth.instance'
import { GlobalExceptionFilter } from './core/filters/global-exception-filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app
    .useGlobalFilters(new GlobalExceptionFilter())
    .use(helmet())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .setGlobalPrefix('api')
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    .enableCors({
      origin: [...env.CORS_ORIGIN],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    })

  // Enable Swagger based on a variable condition
  if (env.SWAGGER_ENABLED === true) {
    const config = new DocumentBuilder()
      .setTitle('Backend API')
      .setDescription('API for the backend')
      .setVersion('1.0')
      .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, documentFactory, {
      jsonDocumentUrl: 'docs/json',
    })
  }

  const authService = app.get(AuthService)
  const server = app.getHttpAdapter().getInstance()

  server.all(/^\/api\/v1\/auth(\/.*)?$/, async (req, res) => {
    await betterAuthExpressHandler(req, res, authService.auth)
  })

  await app.listen(env.PORT)
}

void bootstrap()
