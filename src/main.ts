import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmet } from './utils/express.plugins'
import { env } from 'process'
import { ConfigService } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService)
  app.use(helmet)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.setGlobalPrefix('api');
  await app.listen(1092);
}
bootstrap();
