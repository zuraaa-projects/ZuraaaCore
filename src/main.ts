import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmet } from './utils/express.plugins'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  await app.listen(1092);
}
bootstrap();
