import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1715169600000 implements MigrationInterface {
  name = 'InitialSchema1715169600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`fullName\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`role\` enum('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
        \`avatarUrl\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_users_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`categories\` (
        \`id\` varchar(255) NOT NULL,
        \`labelAz\` varchar(255) NOT NULL,
        \`labelRu\` varchar(255) NOT NULL,
        \`labelEn\` varchar(255) NOT NULL,
        \`slug\` varchar(255) NOT NULL,
        \`icon\` varchar(255) NULL,
        UNIQUE INDEX \`IDX_categories_slug\` (\`slug\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`products\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`nameRu\` varchar(255) NOT NULL,
        \`nameEn\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`descriptionRu\` text NULL,
        \`descriptionEn\` text NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`oldPrice\` decimal(10,2) NULL,
        \`rating\` float NOT NULL DEFAULT '0',
        \`reviewCount\` int NOT NULL DEFAULT '0',
        \`categoryId\` varchar(255) NOT NULL,
        \`image\` varchar(255) NOT NULL,
        \`images\` text NULL,
        \`inStock\` tinyint NOT NULL DEFAULT '1',
        \`isNew\` tinyint NOT NULL DEFAULT '0',
        \`isBestSeller\` tinyint NOT NULL DEFAULT '0',
        \`weight\` varchar(255) NULL,
        \`material\` varchar(255) NULL,
        \`dimensions\` varchar(255) NULL,
        \`badge\` varchar(255) NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_products_category\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`wishlist\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`userId\` int NOT NULL,
        \`productId\` int NOT NULL,
        UNIQUE INDEX \`UQ_wishlist_user_product\` (\`userId\`, \`productId\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_wishlist_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_wishlist_product\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`sessions\` (
        \`id\` varchar(255) NOT NULL,
        \`userId\` int NOT NULL,
        \`expiresAt\` datetime NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_sessions_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`orders\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`userId\` int NOT NULL,
        \`status\` enum('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
        \`totalPrice\` decimal(10,2) NOT NULL,
        \`address\` varchar(255) NULL,
        \`city\` varchar(255) NULL,
        \`district\` varchar(255) NULL,
        \`zipCode\` varchar(255) NULL,
        \`phone\` varchar(255) NULL,
        \`note\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_orders_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`order_items\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`orderId\` int NOT NULL,
        \`productId\` int NOT NULL,
        \`quantity\` int NOT NULL,
        \`unitPrice\` decimal(10,2) NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_order_items_order\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_order_items_product\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`reviews\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`message\` text NOT NULL,
        \`rating\` int NOT NULL,
        \`productId\` int NOT NULL,
        \`userId\` int NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_reviews_product\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_reviews_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `reviews`');
    await queryRunner.query('DROP TABLE `order_items`');
    await queryRunner.query('DROP TABLE `orders`');
    await queryRunner.query('DROP TABLE `sessions`');
    await queryRunner.query('DROP TABLE `wishlist`');
    await queryRunner.query('DROP TABLE `products`');
    await queryRunner.query('DROP TABLE `categories`');
    await queryRunner.query('DROP TABLE `users`');
  }
}
