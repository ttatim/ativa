import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { BaseCreateColumns } from '../baseCreateTable';

export class ListOfAttendanceRoomMembersMigration1618844532726
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'listOfAttendanceRoomMembers',
        columns: [
          ...BaseCreateColumns,
          {
            name: 'id_attendanceRoom',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'id_member_operator',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'id_member_telepresenca',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'listOfAttendanceRoomMembers',
      new TableForeignKey({
        name: 'ForeignKey_idAttendanceRoom_ListOfAttendanceRoom',
        columnNames: ['id_attendanceRoom'],
        referencedColumnNames: ['id'],
        referencedTableName: 'attendanceRoom',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'listOfAttendanceRoomMembers',
      new TableForeignKey({
        name: 'ForeignKey_idMember_operator_ListOfAttendanceRoom',
        columnNames: ['id_member_operator'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operator',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'listOfAttendanceRoomMembers',
      new TableForeignKey({
        name: 'ForeignKey_idMember_telepresenca_ListOfAttendanceRoom',
        columnNames: ['id_member_telepresenca'],
        referencedColumnNames: ['id'],
        referencedTableName: 'telepresenca',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'listOfAttendanceRoomMembers',
      'ForeignKey_idMember_telepresenca_ListOfAttendanceRoom'
    );
    await queryRunner.dropForeignKey(
      'listOfAttendanceRoomMembers',
      'ForeignKey_idMember_operator_ListOfAttendanceRoom'
    );
    await queryRunner.dropForeignKey(
      'listOfAttendanceRoomMembers',
      'ForeignKey_idAttendanceRoom_ListOfAttendanceRoom'
    );
    await queryRunner.dropTable('listOfAttendanceRoomMembers');
  }
}
