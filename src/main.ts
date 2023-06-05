import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Dayjs config
  dayjs.extend(utc);

  await app.listen(3000);
}
bootstrap();
