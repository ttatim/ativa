"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.authenticate = exports.store = void 0;
const express_validator_1 = require("express-validator");
const base_validator_1 = require("./base-validator");
exports.store = [
    express_validator_1.body('name').notEmpty().withMessage('Name cannot be empty'),
    express_validator_1.body('password').notEmpty().withMessage('Password cannot be empty'),
    express_validator_1.body('email').notEmpty().withMessage('Email cannot be empty'),
    base_validator_1.validation,
];
exports.authenticate = [
    express_validator_1.body('password').notEmpty().withMessage('Password cannot be empty'),
    express_validator_1.body('email').notEmpty().withMessage('Email cannot be empty'),
    base_validator_1.validation,
];
exports.forgotPassword = [
    express_validator_1.body('email').notEmpty().withMessage('Email cannot be empty'),
    base_validator_1.validation,
];
//# sourceMappingURL=operator-validator.js.map