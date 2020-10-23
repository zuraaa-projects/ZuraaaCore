import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';
import { helmet } from './utils/express.plugins'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.setGlobalPrefix(env.server_prefix || '');
  await app.listen(env.server_port!);

  console.log({
    port: env.server_port,
    prefix: env.server_prefix
  })
}
bootstrap();
