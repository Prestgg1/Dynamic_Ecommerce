import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../guards/admin.guard';
import { ContactMessagesService } from './contact-messages.service';
import {
  CreateContactMessageDto,
  UpdateContactMessageDto,
} from './dtos/contact-message.dto';

@ApiTags('contact-messages')
@Controller('contact-messages')
export class ContactMessagesController {
  constructor(private readonly contactMessagesService: ContactMessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create public contact message' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateContactMessageDto) {
    return this.contactMessagesService.create(dto);
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'List contact messages (Admin only)' })
  findAll() {
    return this.contactMessagesService.findAll();
  }

  @Patch('admin/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update contact message (Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateContactMessageDto) {
    return this.contactMessagesService.update(+id, dto);
  }

  @Patch('admin/:id/read')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Mark contact message as read (Admin only)' })
  markRead(@Param('id') id: string) {
    return this.contactMessagesService.markRead(+id);
  }

  @Delete('admin/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete contact message (Admin only)' })
  remove(@Param('id') id: string) {
    return this.contactMessagesService.remove(+id);
  }
}
