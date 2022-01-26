"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOfAttendanceRoomMembersMigration1618844532726 = void 0;
const typeorm_1 = require("typeorm");
const baseCreateTable_1 = require("../baseCreateTable");
class ListOfAttendanceRoomMembersMigration1618844532726 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'listOfAttendanceRoomMembers',
            columns: [
                ...baseCreateTable_1.BaseCreateColumns,
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
        }));
        await queryRunner.createForeignKey('listOfAttendanceRoomMembers', new typeorm_1.TableForeignKey({
            name: 'ForeignKey_idAttendanceRoom_ListOfAttendanceRoom',
            columnNames: ['id_attendanceRoom'],
            referencedColumnNames: ['id'],
            referencedTableName: 'attendanceRoom',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.createForeignKey('listOfAttendanceRoomMembers', new typeorm_1.TableForeignKey({
            name: 'ForeignKey_idMember_operator_ListOfAttendanceRoom',
            columnNames: ['id_member_operator'],
            referencedColumnNames: ['id'],
            referencedTableName: 'operator',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.createForeignKey('listOfAttendanceRoomMembers', new typeorm_1.TableForeignKey({
            name: 'ForeignKey_idMember_telepresenca_ListOfAttendanceRoom',
            columnNames: ['id_member_telepresenca'],
            referencedColumnNames: ['id'],
            referencedTableName: 'telepresenca',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('listOfAttendanceRoomMembers', 'ForeignKey_idMember_telepresenca_ListOfAttendanceRoom');
        await queryRunner.dropForeignKey('listOfAttendanceRoomMembers', 'ForeignKey_idMember_operator_ListOfAttendanceRoom');
        await queryRunner.dropForeignKey('listOfAttendanceRoomMembers', 'ForeignKey_idAttendanceRoom_ListOfAttendanceRoom');
        await queryRunner.dropTable('listOfAttendanceRoomMembers');
    }
}
exports.ListOfAttendanceRoomMembersMigration1618844532726 = ListOfAttendanceRoomMembersMigration1618844532726;
//# sourceMappingURL=1618844532726-ListOfAttendanceRoomMembersMigration.js.map