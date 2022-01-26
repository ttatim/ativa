"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorMigration1617285279846 = void 0;
const typeorm_1 = require("typeorm");
const baseCreateTable_1 = require("../baseCreateTable");
class OperatorMigration1617285279846 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'operator',
            columns: [
                ...baseCreateTable_1.BaseCreateColumns,
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
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('operator');
    }
}
exports.OperatorMigration1617285279846 = OperatorMigration1617285279846;
//# sourceMappingURL=1617285279846-OperatorMigration.js.map