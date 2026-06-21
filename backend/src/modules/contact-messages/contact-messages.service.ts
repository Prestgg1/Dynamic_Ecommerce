import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ContactMessage,
  ContactMessageStatus,
} from './entities/contact-message.entity';
import {
  CreateContactMessageDto,
  UpdateContactMessageDto,
} from './dtos/contact-message.dto';

@Injectable()
export class ContactMessagesService {
  private readonly logger = new Logger(ContactMessagesService.name);

  constructor(
    @InjectRepository(ContactMessage)
    private readonly repository: Repository<ContactMessage>,
  ) {}

  findAll() {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, dto: UpdateContactMessageDto) {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Contact message #${id} not found`);
    }
    Object.assign(existing, dto);
    return this.repository.save(existing);
  }

  async remove(id: number) {
    await this.repository.delete(id);
  }

  async markRead(id: number) {
    return this.update(id, { status: ContactMessageStatus.READ });
  }

  async create(dto: CreateContactMessageDto) {
    const message = this.repository.create({
      ...dto,
      status: ContactMessageStatus.NEW,
    });
    const saved = await this.repository.save(message);
    await this.notifyByEmail(saved);
    return saved;
  }

  private async notifyByEmail(message: ContactMessage) {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_NOTIFY_EMAIL;
    const from = process.env.MAIL_FROM ?? 'DəmirMart <onboarding@resend.dev>';

    if (!apiKey || !to) {
      this.logger.log(
        `Contact message stored. Email notification is disabled because RESEND_API_KEY or CONTACT_NOTIFY_EMAIL is missing.`,
      );
      return;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          subject: `Yeni əlaqə mesajı: ${message.fullName}`,
          text: [
            `Ad: ${message.fullName}`,
            `Email: ${message.email}`,
            `Telefon: ${message.phone || '-'}`,
            '',
            message.message,
          ].join('\n'),
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        this.logger.warn(`Email notification failed: ${response.status} ${body}`);
      }
    } catch (error) {
      this.logger.warn(
        `Email notification error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
