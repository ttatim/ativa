"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.getMany = exports.getById = exports.authenticate = exports.store = void 0;
const express_validator_1 = require("express-validator");
const base_validator_1 = require("./base-validator");
exports.store = [
    express_validator_1.body('name').notEmpty().withMessage('Name cannot be empty'),
    express_validator_1.body('password').notEmpty().withMessage('Password cannot be empty'),
    express_validator_1.body('login').notEmpty().withMessage('Email cannot be empty'),
    base_validator_1.validation,
];
exports.authenticate = [
    express_validator_1.body('password').notEmpty().withMessage('Password cannot be empty'),
    express_validator_1.body('login').notEmpty().withMessage('Login cannot be empty'),
    base_validator_1.validation,
];
exports.getById = [
    express_validator_1.param('id').notEmpty().withMessage('Id can not be empty'),
    express_validator_1.param('id').isUUID(4).withMessage('ID is not uuid'),
    base_validator_1.validation,
];
exports.getMany = [
    express_validator_1.query('name').not().isArray().withMessage(`Name cann't be array`),
    express_validator_1.query('login').not().isArray().withMessage(`Login cann't be array`),
    base_validator_1.validation,
];
exports.setPassword = [
    express_validator_1.param('id').notEmpty().withMessage('Id can not be empty'),
    express_validator_1.body('password').notEmpty().withMessage('Password cannot be empty'),
    base_validator_1.validation,
];
//# sourceMappingURL=telepresenca-validator.js.map