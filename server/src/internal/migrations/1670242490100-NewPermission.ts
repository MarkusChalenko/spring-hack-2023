import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewPermission1670242490100 implements MigrationInterface {
  name = 'NewPermission1670242490100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`name\` \`name\` enum ('find_all_users', 'find_one_user', 'create_user', 'update_user', 'delete_user', 'find_all_roles', 'find_one_role', 'create_role', 'update_role', 'delete_role') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`name\` \`name\` enum ('find_all_users', 'find_one_user', 'create_user', 'update_user', 'delete_user') NOT NULL`,
    );
  }
}
