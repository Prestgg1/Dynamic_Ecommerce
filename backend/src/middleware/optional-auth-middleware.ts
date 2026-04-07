import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';


// src/auth/interfaces/request-with-user.interface.ts
import { Request } from 'express';
import { User } from 'src/modules/users/entities/user.entity';

export interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const sid = req.cookies?.sid as string | undefined;

    if (sid) {
      const user = await this.authService.validateSession(sid);
      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
