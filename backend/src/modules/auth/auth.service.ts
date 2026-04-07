import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RegisterDto } from '../../dtos/register.dto';
import { LoginDto } from '../../dtos/login.dto';
import { UpdateProfileDto } from '../../dtos/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password, repassword } = dto;
    if (password !== repassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      fullName: name,
      email,
      password: hashedPassword,
    });

    return this.createSession(user.id);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSession(user.id);
  }

  async logout(sessionId: string) {
    await this.sessionRepository.delete({ id: sessionId });
  }

  private async createSession(userId: number) {
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = this.sessionRepository.create({
      id: sessionId,
      userId,
      expiresAt,
    });
    await this.sessionRepository.save(session);

    return sessionId;
  }

  async validateSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.sessionRepository.delete(session.id);
      }
      return null;
    }
    return session.user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.usersService.update(userId, dto);
  }
}
