import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../guards/admin.guard';
import { SiteContentService } from './site-content.service';

@ApiTags('site-content')
@Controller('site-settings')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get public site settings' })
  @ApiResponse({ status: 200 })
  getMain() {
    return this.siteContentService.getMain();
  }

  @Put()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update site settings (Admin only)' })
  @ApiResponse({ status: 200 })
  updateMain(@Body() body: Record<string, any>) {
    return this.siteContentService.updateMain(body);
  }
}
