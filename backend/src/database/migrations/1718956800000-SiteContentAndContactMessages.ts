import { MigrationInterface, QueryRunner } from 'typeorm';

export class SiteContentAndContactMessages1718956800000
  implements MigrationInterface
{
  name = 'SiteContentAndContactMessages1718956800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`site_settings\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`key\` varchar(255) NOT NULL,
        \`data\` json NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_site_settings_key\` (\`key\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE \`contact_messages\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fullName\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`phone\` varchar(255) NULL,
        \`message\` text NOT NULL,
        \`status\` enum('NEW','READ','ARCHIVED') NOT NULL DEFAULT 'NEW',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `contact_messages`');
    await queryRunner.query('DROP TABLE `site_settings`');
  }
}
