import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { ContactMessagesService } from './contact-messages.service';
import { ContactMessagesController } from './contact-messages.controller';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../../guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage]), AuthModule],
  providers: [ContactMessagesService, AdminGuard],
  controllers: [ContactMessagesController],
  exports: [ContactMessagesService],
})
export class ContactMessagesModule {}
