import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { SiteContentService } from './site-content.service';
import { SiteContentController } from './site-content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSetting])],
  providers: [SiteContentService],
  controllers: [SiteContentController],
  exports: [SiteContentService],
})
export class SiteContentModule {}
