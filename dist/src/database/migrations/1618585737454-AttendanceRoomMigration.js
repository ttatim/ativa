"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRoomMigration1618585737454 = void 0;
const typeorm_1 = require("typeorm");
const baseCreateTable_1 = require("../baseCreateTable");
class AttendanceRoomMigration1618585737454 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'attendanceRoom',
            columns: [
                ...baseCreateTable_1.BaseCreateColumns,
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('attendanceRoom');
    }
}
exports.AttendanceRoomMigration1618585737454 = AttendanceRoomMigration1618585737454;
//# sourceMappingURL=1618585737454-AttendanceRoomMigration.js.map