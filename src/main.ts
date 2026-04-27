import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import express from 'express'
import helmet from 'helmet'
import 'reflect-metadata'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '~/app.module'
import { env } from '~/core/env'
import { GlobalExceptionFilter } from '~/core/filters/global-exception-filter'
import { betterAuthHandler } from '~/modules/auth/infra/better-auth.handler'
import { NodeEnv } from '~/shared/const/app.const'

const isProduction = env.NODE_ENV === NodeEnv.production

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)

    // INIT BETTER AUTH
    const server = app.getHttpAdapter().getInstance()
    server.use(env.BETTER_AUTH_BASE_PATH, betterAuthHandler)

    // Enabled helmet gaurd by prod flag
    if (isProduction) {
      app.use(helmet())
    }
    app
      .useGlobalFilters(new GlobalExceptionFilter())
      .use(express.json())
      .use(
        express.urlencoded({
          extended: true,
        }),
      )
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
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
      )
      .enableCors({
        origin: isProduction ? [...env.CORS_ORIGIN] : '*',
        credentials: isProduction,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      })

    // Enable Swagger based on a variable condition
    if (env.SWAGGER_ENABLED === true) {
      const config = new DocumentBuilder()
        .setTitle('Backend API')
        .setDescription('API for the backend')
        .setVersion('1.0')
        .build()
      const documentFactory = () =>
        SwaggerModule.createDocument(app, config)
      SwaggerModule.setup('docs', app, documentFactory, {
        jsonDocumentUrl: 'docs/json',
      })
    }
    await app.listen(env.PORT)
  } catch (err) {
    console.error('BOOTSTRAP_ERROR', err)
    throw err
  }
}

void bootstrap().catch((err) => {
  console.log(err)
  process.exit(1)
})

process.on('exit', (code) => {
  console.log('PROCESS_EXIT', code)
})

process.on('beforeExit', (code) => {
  console.log('PROCESS_BEFORE_EXIT', code)
})

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT_EXCEPTION', error)
})

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED_REJECTION', reason)
})
