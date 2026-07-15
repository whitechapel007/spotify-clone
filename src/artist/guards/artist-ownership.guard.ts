import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ArtistService } from '../artist.service';
import type { Request } from 'express';
import type { User } from '../../user/user.entity';
import { Role } from '../../auth/enums/role.enum';

interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Checks that the current user is either the linked user of the artist profile or an admin.
 * Must be used after JwtAuthGuard to ensure request.user exists.
 */
@Injectable()
export class ArtistOwnershipGuard implements CanActivate {
  constructor(private readonly artistService: ArtistService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const artistId = (request.params as Record<string, string>).id;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!artistId) {
      throw new ForbiddenException('Artist ID not found');
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    const artist = await this.artistService.findOne(artistId);

    if (artist.user.id !== user.id) {
      throw new ForbiddenException('You do not own this artist profile.');
    }

    return true;
  }
}
