// src/common/guards/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // OptionalAuthMiddleware-dən gələn user-i yoxlayırıq
    if (user && user.role === 'admin') {
      return true;
    }

    throw new ForbiddenException('Bu əməliyyat üçün admin hüququnuz yoxdur');
  }
}
