import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

import { HttpExceptionFilter } from 'common/filters/HttpExceptionFilter.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('Blood Pressure App')
    .setDescription('The Blood Pressure App API description')
    .setVersion('Beta')
    .addTag('Auth', 'Authentication')
    .addTag('User', 'User Management')
    .addTag('BloodPressure', 'Blood Pressure Management')
    .addBearerAuth(
      {
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      process.env.JWT_AUTH_NAME
    )
    .setBasePath('/api')
    .build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    useGlobalPrefix: true,
  })

  await app.listen(String(process.env.APP_PORT))
}
bootstrap()
