// src/common/guards/admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../modules/users/entities/user.entity';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      const sid = request.cookies?.sid as string | undefined;

      if (sid) {
        const user = await this.authService.validateSession(sid);
        if (user) {
          request.user = user;
        }
      }
    }

    const user = request.user;
    if (user && user.role === UserRole.ADMIN) {
      return true;
    }

    throw new ForbiddenException('Bu əməliyyat üçün admin hüququnuz yoxdur');
  }
}
