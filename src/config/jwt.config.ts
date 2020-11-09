import { get } from 'config';

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export const jwtConfig = get<JwtConfig>('jwt');
