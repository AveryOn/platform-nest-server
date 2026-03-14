import { env } from '~/core/env'
import helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '~/app.module'
import { JsonResponseInterceptor } from '~/core/interceptors/json-response.interceptor'
import { GlobalExceptionFilter } from '~/core/filters/global-exception-filter'

async function bootstrap() {
  if(env.CLEAR_CONSOLE_BY_START) {
    console.clear()
  }
  const app = await NestFactory.create(AppModule, { 
    logger: env.NEST_LOGGER_ENABLED === false 
    ? false : void Infinity
  })

  app
    .useGlobalFilters(new GlobalExceptionFilter())
    .use(helmet())
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
    .useGlobalInterceptors(new JsonResponseInterceptor())
    .enableVersioning()
    .enableCors({
      origin: [...env.CORS_ORIGIN],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
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

  await app.listen(env.PORT)
}

void bootstrap()
