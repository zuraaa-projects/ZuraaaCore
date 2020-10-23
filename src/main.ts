import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmet } from './utils/express.plugins'
import { env } from 'process'
import dotenv from 'dotenv'



async function bootstrap() {
  dotenv.config()


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
