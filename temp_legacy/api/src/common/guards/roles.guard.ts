import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthUser } from '../types';

// Role hierarchy — support/manager/admin inherit customer+owner-level access implicitly
// where useful, but explicit role checks below keep authorization decisions obvious.
const RANK: Record<string, number> = {
  customer: 0,
  owner: 1,
  support: 2,
  manager: 3,
  admin: 4,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    if (!user) throw new ForbiddenException('Not authenticated');

    const allowed = required.some((r) => {
      if (r === user.role) return true;
      // admins/managers can access anything an explicitly-listed lower role can
      return (
        (RANK[user.role] ?? -1) > (RANK[r] ?? Infinity) &&
        RANK[user.role] >= RANK.support
      );
    });

    if (!allowed) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
