import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const serverConfig = config.get<{
    port: number;
    origin: CorsOptions['origin'];
  }>('server');
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
