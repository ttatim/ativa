import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseCreateColumns } from '../baseCreateTable';

export class TelepresencaMigration1617630614342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'telepresenca',
        columns: [
          ...BaseCreateColumns,
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'login',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('telepresenca');
  }
}
