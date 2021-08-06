import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  await app.listen(PORT);
}
bootstrap();
