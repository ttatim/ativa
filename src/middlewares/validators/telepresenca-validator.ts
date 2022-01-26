import { body, param, query } from 'express-validator';
import { validation } from './base-validator';

export const store = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('login').notEmpty().withMessage('Email cannot be empty'),
  validation,
];

export const authenticate = [
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('login').notEmpty().withMessage('Login cannot be empty'),
  validation,
];

export const getById = [
  param('id').notEmpty().withMessage('Id can not be empty'),
  param('id').isUUID(4).withMessage('ID is not uuid'),
  validation,
];

export const getMany = [
  query('name').not().isArray().withMessage(`Name cann't be array`),
  query('login').not().isArray().withMessage(`Login cann't be array`),
  validation,
];

export const setPassword = [
  param('id').notEmpty().withMessage('Id can not be empty'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  validation,
];
