import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmet } from './utils/express.plugins'

import { server } from '../config.json'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.table({
    port: server.port,
    prefix: server.prefix
  })
  
  app.use(helmet)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.setGlobalPrefix(server.prefix);
  await app.listen(server.port);
}
bootstrap();
