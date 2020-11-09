import { get } from 'config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export interface ServerConfig extends CorsOptions {
  port: number;
}

export const serverConfig = get<ServerConfig>('server');
