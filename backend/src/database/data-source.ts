import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { buildDatabaseConfig } from './typeorm.config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize the data source');
}

export default new DataSource(buildDatabaseConfig(databaseUrl));
