"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const express_validator_1 = require("express-validator");
const base_validator_1 = require("./base-validator");
exports.store = [
    express_validator_1.body('id_attendanceRoom')
        .notEmpty()
        .withMessage('Attendance Room cannot be empty'),
    express_validator_1.body('type').notEmpty().withMessage('Type cannot be empty'),
    express_validator_1.oneOf([
        express_validator_1.body('id_member_operator')
            .notEmpty()
            .withMessage('Operator can not be empty'),
        express_validator_1.body('id_member_telepresenca')
            .notEmpty()
            .withMessage('Telepresenca can not be empty'),
    ]),
    base_validator_1.validation,
];
//# sourceMappingURL=listOfAttendanceRoomMember.js.map