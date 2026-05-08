import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      const sid = req.cookies?.sid as string | undefined;

      if (sid) {
        const user = await this.authService.validateSession(sid);
        if (user) {
          req.user = user;
        }
      }
    }

    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }
}
