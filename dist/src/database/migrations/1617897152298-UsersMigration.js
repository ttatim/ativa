"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersMigration1617897152298 = void 0;
const typeorm_1 = require("typeorm");
const baseCreateTable_1 = require("../baseCreateTable");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
class UsersMigration1617897152298 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
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
        }));
        const password = bcryptjs_1.default.hashSync('EBSVision.76', 8);
        await queryRunner.query(`INSERT INTO users (id, name, login, password, email, type) 
        VALUES ('${uuid_1.v4()}' ,'admin', 'admin', '${password}', 'admin@admin.com', 'master' )`);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('users');
    }
}
exports.UsersMigration1617897152298 = UsersMigration1617897152298;
//# sourceMappingURL=1617897152298-UsersMigration.js.map