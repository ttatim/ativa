import { body, param, query } from 'express-validator';
import { validation } from './base-validator';

export const store = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  validation,
];
