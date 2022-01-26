"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const express_validator_1 = require("express-validator");
const base_validator_1 = require("./base-validator");
exports.store = [
    express_validator_1.body('name').notEmpty().withMessage('Name cannot be empty'),
    base_validator_1.validation,
];
//# sourceMappingURL=attendanceRoom-validator.js.map