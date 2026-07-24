import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { ApiKeyAuthGuard } from './api-key-auth.guard';

/**
 * Accepts either a JWT bearer token or an `x-api-key` header.
 * Routes using this guard can be called by end users (JWT) or
 * service-to-service clients (API key).
 */
@Injectable()
export class JwtOrApiKeyAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly apiKeyAuthGuard: ApiKeyAuthGuard) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (typeof request.headers['x-api-key'] === 'string') {
      return this.apiKeyAuthGuard.canActivate(context);
    }

    return super.canActivate(context) as Promise<boolean> | boolean;
  }
}
