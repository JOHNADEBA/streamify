import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
      throw new Error(
        'Clerk API keys are missing. Please check your .env file.',
      );
    }

    try {
      return ClerkExpressWithAuth()(req, res, next);
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
