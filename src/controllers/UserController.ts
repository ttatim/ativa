import { Controller, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import UserRepository from '@src/repository/UserRepository';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as validator from '@src/middlewares/validators/user-validator';
import { authenticate } from '@src/middlewares/services/AuthenticateService';

@Controller('user')
export class UserController {
  @Post('signin')
  @Middleware(validator.signin)
  public async signin(req: Request, res: Response): Promise<void> {
    try {
      const { login, password } = req.body;
      const user = await UserRepository.getByEmailOrLogin(login);
      if (!user) {
        res.status(401).send({
          msg: `Unauthorized access`,
          code: 401,
          error: 'Unauthorized',
        });
        return;
      }

      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).send({
          msg: `Unauthorized access`,
          code: 401,
          error: 'Unauthorized',
        });
        return;
      }

      const token = await jwt.sign({ id: user.id }, process.env.TOKEN || 'ola');
      res.status(200).send({
        data: { id: user.id, name: user.name },
        token,
      });

      res.status(200).send();
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Put('password')
  @Middleware(authenticate)
  @Middleware(validator.setPassword)
  public async setPassword(req: Request, res: Response): Promise<void> {
    try {
      const { old_password, new_password } = req.body;
      const { id } = req.decoded;
      if (!id) {
        res.status(401).send({
          msg: 'Restricted access',
          code: 401,
          error: 'Unauthorized',
        });
        return;
      }
      const user = await UserRepository.getById(id);

      if (!user) {
        res.status(403).send({
          msg: 'Restricted access',
          code: 401,
          error: 'Unauthorized',
        });
        return;
      }

      const isValidPassword = await bcryptjs.compare(
        old_password,
        user.password
      );

      if (!isValidPassword) {
        res.status(401).send({
          msg: `Unauthorized access`,
          code: 401,
          error: 'Unauthorized',
        });
        return;
      }

      const setPassoword = await bcryptjs.hashSync(new_password, 8);

      const result = await UserRepository.setPassoword(setPassoword, id);
      if (result) {
        res.status(200).send({
          msg: 'Successful process',
        });
      }

      res.status(200).send();
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }
}
