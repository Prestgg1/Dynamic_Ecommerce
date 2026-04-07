import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userParams: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userParams);
    return this.userRepository.save(user);
  }

  async update(id: number, params: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, params);
    return this.findById(id);
  }
}
