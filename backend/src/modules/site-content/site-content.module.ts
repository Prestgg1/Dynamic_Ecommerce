import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { SiteContentService } from './site-content.service';
import { SiteContentController } from './site-content.controller';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../../guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSetting]), AuthModule],
  providers: [SiteContentService, AdminGuard],
  controllers: [SiteContentController],
  exports: [SiteContentService],
})
export class SiteContentModule {}
