import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseCreateColumns } from '../baseCreateTable';

export class OperatorMigration1617285279846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "unaccent"');
    // await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'operator',
        columns: [
          ...BaseCreateColumns,
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'request',
            type: 'varchar',
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operator');
    // await queryRunner.query('DROP EXTENSION "uuid-ossp"');
    // await queryRunner.query('DROP EXTENSION "unaccent"');
  }
}
