"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.signin = void 0;
const express_validator_1 = require("express-validator");
const base_validator_1 = require("./base-validator");
exports.signin = [
    express_validator_1.body('password').notEmpty().withMessage('Password cannot be empty'),
    express_validator_1.body('login').notEmpty().withMessage('Login cannot be empty'),
    base_validator_1.validation,
];
exports.setPassword = [
    express_validator_1.body('old_password').notEmpty().withMessage('Old password cannot be empty'),
    express_validator_1.body('new_password').notEmpty().withMessage('New password cannot be empty'),
    base_validator_1.validation,
];
//# sourceMappingURL=user-validator.js.map