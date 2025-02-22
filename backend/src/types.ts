import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PREMIUM = 'PREMIUM',
}
