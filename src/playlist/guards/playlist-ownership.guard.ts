import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PlaylistService } from '../playlist.service';
import type { Request } from 'express';
import type { User } from '../../user/user.entity';
import { isOwnerOrAdmin } from './is-owner-or-admin';

interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Checks that the current user is either the owner of the playlist or an admin.
 * Must be used after JwtAuthGuard to ensure request.user exists.
 */
@Injectable()
export class PlaylistOwnershipGuard implements CanActivate {
  constructor(private readonly playlistService: PlaylistService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const playlistId = (request.params as Record<string, string>).id;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!playlistId) {
      throw new ForbiddenException('Playlist ID not found');
    }

    const playlist = await this.playlistService.findOne(playlistId, user);

    if (!isOwnerOrAdmin(user, playlist.userId)) {
      throw new ForbiddenException('You do not own this playlist.');
    }
    return true;
  }
}
