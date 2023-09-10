import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BaseExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filter config
  app.useGlobalFilters(new BaseExceptionFilter());

  // CORS config
  app.enableCors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Dayjs config
  dayjs.extend(utc);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Recrit API')
    .setDescription('Recrit API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
