import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseCreateColumns } from '../baseCreateTable';
import bcryptjs from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

export class UsersMigration1617897152298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
        ],
      })
    );

    const password = bcryptjs.hashSync('EBSVision.76', 8);
    await queryRunner.query(
      `INSERT INTO users (id, name, login, password, email, type) 
        VALUES ('${uuidV4()}' ,'admin', 'admin', '${password}', 'admin@admin.com', 'master' )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
