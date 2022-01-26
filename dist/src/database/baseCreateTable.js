"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCreateColumns = void 0;
exports.BaseCreateColumns = [
    {
        name: 'id',
        type: 'varchar',
        isPrimary: true,
        generationStrategy: 'uuid',
    },
    {
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
    },
    {
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
    },
];
//# sourceMappingURL=baseCreateTable.js.map