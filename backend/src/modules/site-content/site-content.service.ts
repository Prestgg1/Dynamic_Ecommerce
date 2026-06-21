import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { DEFAULT_SITE_SETTINGS } from './site-content.defaults';

@Injectable()
export class SiteContentService {
  constructor(
    @InjectRepository(SiteSetting)
    private readonly settingsRepository: Repository<SiteSetting>,
  ) {}

  async getMain() {
    const existing = await this.settingsRepository.findOne({
      where: { key: 'main' },
    });

    if (existing) {
      return existing;
    }

    return this.settingsRepository.save(
      this.settingsRepository.create(DEFAULT_SITE_SETTINGS),
    );
  }

  async updateMain(data: Record<string, any>) {
    const current = await this.getMain();
    const next = this.mergeDeep(current.data ?? {}, data);
    current.data = next;
    return this.settingsRepository.save(current);
  }

  private mergeDeep(target: Record<string, any>, source: Record<string, any>) {
    const output: Record<string, any> = { ...target };

    for (const [key, value] of Object.entries(source)) {
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        output[key] = this.mergeDeep(output[key] ?? {}, value as Record<string, any>);
      } else {
        output[key] = value;
      }
    }

    return output;
  }
}
