import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Behaves like JwtAuthGuard but never rejects the request: request.user is
 * populated when a valid token is present, and left undefined otherwise.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser) {
    return user as TUser;
  }
}
