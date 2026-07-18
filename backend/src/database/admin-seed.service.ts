import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../modules/users/entities/user.entity';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = (process.env.ADMIN_SEED_EMAIL ?? 'admin@metalx.az').trim();
    const normalizedEmail = email.toLowerCase();
    const password = process.env.ADMIN_SEED_PASSWORD ?? 'Metalx123!';
    const fullName = process.env.ADMIN_SEED_NAME ?? 'Admin';

    const existingAdmins = await this.usersService.findAdmins();
    for (const admin of existingAdmins) {
      if (admin.email.toLowerCase() !== normalizedEmail) {
        await this.usersService.remove(admin.id);
        this.logger.log(`Removed admin with mismatched email: ${admin.email}`);
      }
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      if (existingUser.role !== UserRole.ADMIN) {
        await this.usersService.update(existingUser.id, {
          role: UserRole.ADMIN,
        });
        this.logger.log(`Promoted existing user to admin: ${email}`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.create({
      fullName,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      avatarUrl:
        'https://ui-avatars.com/api/?background=0080e8&color=fff&name=Admin',
    });

    this.logger.log(`Seeded default admin user: ${email}`);
  }
}
