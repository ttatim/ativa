import { body, oneOf } from 'express-validator';
import { validation } from './base-validator';

export const store = [
  body('id_attendanceRoom')
    .notEmpty()
    .withMessage('Attendance Room cannot be empty'),
  body('type').notEmpty().withMessage('Type cannot be empty'),
  oneOf([
    body('id_member_operator')
      .notEmpty()
      .withMessage('Operator can not be empty'),
    body('id_member_telepresenca')
      .notEmpty()
      .withMessage('Telepresenca can not be empty'),
  ]),
  validation,
];
