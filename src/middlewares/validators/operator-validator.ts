import { body, param, oneOf } from 'express-validator';
import { validation } from './base-validator';

export const store = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('email').notEmpty().withMessage('Email cannot be empty'),
  validation,
];

export const authenticate = [
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('email').notEmpty().withMessage('Email cannot be empty'),
  validation,
];

export const forgotPassword = [
  body('email').notEmpty().withMessage('Email cannot be empty'),
  validation,
];

// export const update = [
//   body('id').isUUID(4).withMessage('ID is not uuid'),
//   body('id').notEmpty().withMessage('ID cannot be empty'),
//   oneOf([
//     body('name').notEmpty().withMessage('Name cannot be empty'),
//     body('singer').notEmpty().withMessage('Singer cannot be empty'),
//     body('tone').notEmpty().withMessage('Tone cannot be empty'),
//   ]),
//   validation,
// ];
