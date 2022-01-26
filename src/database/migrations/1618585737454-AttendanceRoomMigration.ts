import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseCreateColumns } from '../baseCreateTable';

export class AttendanceRoomMigration1618585737454
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attendanceRoom',
        columns: [
          ...BaseCreateColumns,
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attendanceRoom');
  }
}
