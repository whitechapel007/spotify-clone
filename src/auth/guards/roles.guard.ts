import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles metadata is present, allow.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: unknown }>();
    const user = request.user;

    if (!user || typeof user !== 'object') {
      throw new UnauthorizedException('Missing authenticated user');
    }

    const role = (user as { role?: unknown }).role;
    if (!role || typeof role !== 'string') {
      throw new UnauthorizedException('Missing authenticated user role');
    }

    if (!requiredRoles.includes(role as Role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
