import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  private clerk: ReturnType<typeof createClerkClient>;
  constructor(private readonly databaseService: DatabaseService) {
    this.clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateAuthDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    const updatedUser = await this.databaseService.user.update({
      where: { id },
      data: updateAuthDto,
    });

    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.databaseService.user.delete({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async verifyToken(token: string) {
    try {
      const verifiedToken = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        authorizedParties: [process.env.FRONTEND_DOMAIN],
      });

      if (!verifiedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const userId = verifiedToken.sub;

      // ✅ Fetch full user details from Clerk
      const clerkUser = await this.clerk.users.getUser(userId);

      if (!clerkUser) {
        throw new UnauthorizedException('User not found');
      }

      const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? '';
      const username =
        clerkUser.username || (email ? email.split('@')[0] : 'unknown_user');
      const profileImage = clerkUser.imageUrl || '';

      let localUser = await this.databaseService.user.findUnique({
        where: { id: userId },
      });

      if (!localUser) {
        localUser = await this.databaseService.user.create({
          data: {
            id: userId,
            email,
            username,
            profileImage,
          },
        });
      }

      return localUser;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
