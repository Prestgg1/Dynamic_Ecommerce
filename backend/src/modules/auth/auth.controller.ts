import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Res,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { RegisterDto } from '../../dtos/register.dto';
import { LoginDto } from '../../dtos/login.dto';
import { User } from '../users/entities/user.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = await this.authService.register(dto);
    res.cookie('sid', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { success: true };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = await this.authService.login(dto);
    res.cookie('sid', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { success: true };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sid = req.cookies?.sid as string | undefined;
    if (sid) {
      await this.authService.logout(sid);
      res.clearCookie('sid');
    }
    return { success: true };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: User })
  async me(@Req() req: Request) {
    const sid = req.cookies?.sid as string | undefined;
    if (!sid) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.authService.validateSession(sid);
    if (!user) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    return user;
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile (supports avatar upload)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, type: User })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `avatar-${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    }),
  )
  async updateProfile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('fullName') fullName?: string,
  ) {
    const sid = req.cookies?.sid as string | undefined;
    if (!sid) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.authService.validateSession(sid);
    if (!user) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    const avatarUrl = file ? `/uploads/${file.filename}` : undefined;

    return this.authService.updateProfile(user.id, {
      ...(fullName ? { fullName } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
    });
  }
}
