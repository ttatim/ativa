import { body, param, query } from 'express-validator';
import { validation } from './base-validator';

export const signin = [
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('login').notEmpty().withMessage('Login cannot be empty'),
  validation,
];

export const setPassword = [
  body('old_password').notEmpty().withMessage('Old password cannot be empty'),
  body('new_password').notEmpty().withMessage('New password cannot be empty'),
  validation,
];
