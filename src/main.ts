import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmet } from './utils/express.plugins'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet)
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
