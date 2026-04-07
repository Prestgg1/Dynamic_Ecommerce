import { NestFactory } from '@nestjs/core';
import { SeedModule } from './database/seed.module';
import { SeedService } from './database/seed.service';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(SeedModule);
    const seedService = app.get(SeedService);
    await seedService.seed();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
}
bootstrap();
