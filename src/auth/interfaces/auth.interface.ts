import { IUser } from '../../users/interfaces/user.interface';

export interface IAuthResponse {
  user: IUser;
  token: string;
  message?: string;
}

export interface ITokenPayload {
  sub: string; // Subject (user ID)
  email: string; // User email
  iat?: number; // Issued at
  exp?: number; // Expiration
}
