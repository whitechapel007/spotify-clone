import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '../../user/user.entity';
import { Role } from '../enums/role.enum';

interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Checks that the current user is either the target user or an admin.
 * Must be used after JwtAuthGuard to ensure request.user exists.
 */
@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const targetUserId = (request.params as Record<string, string>).id;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!targetUserId) {
      throw new ForbiddenException('User ID not found in request');
    }

    // Check if user is admin
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if user is accessing their own profile
    if (user.id === targetUserId) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
