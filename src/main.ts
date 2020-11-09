import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { serverConfig } from './config/server.config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const origin = serverConfig.origin;
  const port = process.env.PORT || serverConfig.port;

  app.enableCors({ origin });
  logger.log(`Accepting requests from origin "${origin}"`);

  await app.listen(port);
  logger.log(`Application listening on port "${port}"`);
}
bootstrap();
