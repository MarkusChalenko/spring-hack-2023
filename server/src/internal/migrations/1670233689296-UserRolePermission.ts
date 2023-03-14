import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolePermission1670233689296 implements MigrationInterface {
  name = 'UserRolePermission1670233689296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('find_all_users', 'find_one_user', 'create_user', 'update_user', 'delete_user') NOT NULL, UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`refresh_token\` varchar(255) NULL, \`restore_password_token\` varchar(255) NULL, \`isEmailConfirmed\` tinyint NOT NULL DEFAULT 0, \`isRegisteredWithGoogle\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles_permissions_permissions\` (\`role_id\` int NOT NULL, \`permission_id\` int NOT NULL, INDEX \`IDX_5a00ec97b502af1504d8ca0caf\` (\`role_id\`), INDEX \`IDX_d59b3105d248d8927feee0b4d7\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_roles_roles\` (\`user_id\` int NOT NULL, \`role_id\` int NOT NULL, INDEX \`IDX_32e5adf0a2e33e130de343c6ee\` (\`user_id\`), INDEX \`IDX_38703d4da3789a6ad8552ba783\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions_permissions\` ADD CONSTRAINT \`FK_5a00ec97b502af1504d8ca0cafe\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions_permissions\` ADD CONSTRAINT \`FK_d59b3105d248d8927feee0b4d73\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_32e5adf0a2e33e130de343c6ee8\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_roles_roles\` ADD CONSTRAINT \`FK_38703d4da3789a6ad8552ba783e\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_38703d4da3789a6ad8552ba783e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_roles_roles\` DROP FOREIGN KEY \`FK_32e5adf0a2e33e130de343c6ee8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions_permissions\` DROP FOREIGN KEY \`FK_d59b3105d248d8927feee0b4d73\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions_permissions\` DROP FOREIGN KEY \`FK_5a00ec97b502af1504d8ca0cafe\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_38703d4da3789a6ad8552ba783\` ON \`users_roles_roles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_32e5adf0a2e33e130de343c6ee\` ON \`users_roles_roles\``,
    );
    await queryRunner.query(`DROP TABLE \`users_roles_roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d59b3105d248d8927feee0b4d7\` ON \`roles_permissions_permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5a00ec97b502af1504d8ca0caf\` ON \`roles_permissions_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`roles_permissions_permissions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`permissions\``);
  }
}
