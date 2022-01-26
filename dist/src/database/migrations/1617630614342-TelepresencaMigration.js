"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelepresencaMigration1617630614342 = void 0;
const typeorm_1 = require("typeorm");
const baseCreateTable_1 = require("../baseCreateTable");
class TelepresencaMigration1617630614342 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'telepresenca',
            columns: [
                ...baseCreateTable_1.BaseCreateColumns,
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
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('telepresenca');
    }
}
exports.TelepresencaMigration1617630614342 = TelepresencaMigration1617630614342;
//# sourceMappingURL=1617630614342-TelepresencaMigration.js.map