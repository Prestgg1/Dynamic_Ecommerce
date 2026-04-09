// src/common/guards/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // OptionalAuthMiddleware-dən gələn user-i yoxlayırıq
    console.log(user)
    if (user && user.role === UserRole.ADMIN) {
      return true;
    }

    throw new ForbiddenException('Bu əməliyyat üçün admin hüququnuz yoxdur');
  }
}
