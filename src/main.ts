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
  app.setGlobalPrefix(configService.get<string>('SERVER_PREFIX') || '');
  await app.listen(configService.get<string>('SERVER_PORT')!);

  console.log({
    port: env.server_port,
    prefix: env.server_prefix
  })
}
bootstrap();
