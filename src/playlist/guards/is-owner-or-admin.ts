import { Role } from '../../auth/enums/role.enum';
import type { User } from '../../user/user.entity';

export function isOwnerOrAdmin(
  user: Pick<User, 'id' | 'role'> | undefined,
  ownerId: string,
): boolean {
  return user?.role === Role.ADMIN || user?.id === ownerId;
}
