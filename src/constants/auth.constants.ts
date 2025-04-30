import { env } from '../config/env.config';

export const JWT_SECRET = env.jwt.secret;
export const JWT_EXPIRES_IN = env.jwt.expiresIn;
