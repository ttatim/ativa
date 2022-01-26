import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
  Put,
} from '@overnightjs/core';
import TelepresencaRepository from '@src/repository/TelepresencaRepository';
import { Request, Response } from 'express';
import * as validator from '@src/middlewares/validators/telepresenca-validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as AuthService from '@src/middlewares/services/AuthenticateService';
import ListOfAttendanceRoomMemberRepository from '@src/repository/ListOfAttendanceRoomMemberRepository';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';

@Controller('telepresenca')
export class TelepresencaController {
  @Post()
  @Middleware(AuthService.authenticate)
  @Middleware(AuthService.isMaster)
  @Middleware(validator.store)
  public async store(req: Request, res: Response): Promise<void> {
    try {
      const { name, login, password } = req.body;

      const loginAlreadyExists = await TelepresencaRepository.getByLogin(login);
      if (loginAlreadyExists) {
        res.status(409).send({
          msg: 'Login already exists',
          code: 409,
          error: 'Conflit',
        });
        return;
      }

      const result = await TelepresencaRepository.store({
        name,
        login,
        password,
      });

      res.status(201).send({ ...result, password: undefined });
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Get('checkMe')
  @Middleware(AuthService.authenticate)
  public async checkToken(req: Request, res: Response): Promise<void> {
    const { id } = req.decoded;
    if (!id) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    const telepresenca = await TelepresencaRepository.getById(id);

    if (!telepresenca) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    const token = await jwt.sign(
      { id: telepresenca.id },
      process.env.TOKEN || 'ola'
    );
    res.status(200).send({
      token,
      data: {
        login: telepresenca.login,
        name: telepresenca.name,
        id: telepresenca.id,
      },
    });
  }

  @Get()
  @Middleware(AuthService.authenticate)
  @Middleware(validator.getMany)
  public async getMany(req: Request, res: Response): Promise<void> {
    try {
      const { name, login } = req.query as { name: string; login: string };
      const telepresenca = await TelepresencaRepository.getMany({
        name,
        login,
      });

      if (telepresenca) {
        res
          .status(200)
          .send(
            telepresenca.map((element) => ({ ...element, password: undefined }))
          );
        return;
      }
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Post('signin')
  @Middleware(validator.authenticate)
  public async signin(req: Request, res: Response): Promise<void> {
    try {
      const { login, password } = req.body;
      const telepresencaToAutheticate = await TelepresencaRepository.getWithPassword(
        login
      );
      if (!telepresencaToAutheticate) {
        res.status(404).send({
          error: 'Not found',
          code: 404,
          msg: 'Login or password invalid',
        });
        return;
      }

      const isValidPassword = await bcryptjs.compare(
        password,
        telepresencaToAutheticate.password
      );

      if (!isValidPassword) {
        res.status(404).send({
          error: 'Not found',
          code: 404,
          msg: 'Login or password invalid',
        });
        return;
      }

      const token = await jwt.sign(
        { id: telepresencaToAutheticate.id },
        process.env.TOKEN || 'ola'
      );
      res.status(200).send({
        token,
        data: {
          login: telepresencaToAutheticate.login,
          name: telepresencaToAutheticate.name,
          id: telepresencaToAutheticate.id,
        },
      });
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Get('room')
  @Middleware([AuthService.authenticate, AuthService.isTelepresenca])
  public async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const id = req.decoded.id || '';
      const itemListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository.findOne(
        { id_member_telepresenca: id } as ListOfAttendanceRoomMember
      );
      res.status(200).send(itemListOfAttendanceRoomMember);
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Get(':id')
  @Middleware(AuthService.authenticate)
  @Middleware(validator.getById)
  public async getById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== 'string') {
        res.status(400).send({
          msg: 'Bad request',
          code: 400,
          error: 'Not Found',
        });
      }
      const telepresenca = await TelepresencaRepository.getById(id);
      if (telepresenca) {
        res.status(200).send(telepresenca);
        return;
      }
      res.status(404).send({
        msg: 'Request not found',
        code: 404,
        error: 'Not Found',
      });
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Put('password')
  @Middleware(AuthService.authenticate)
  @Middleware(AuthService.isMaster)
  public async setPassword(req: Request, res: Response): Promise<void> {
    try {
      const { id, password } = req.body;
      const isSetPassowrd = await TelepresencaRepository.setPassword(
        id,
        password
      );
      if (isSetPassowrd) {
        res.status(200).send({ msg: 'Request Success' });
        return;
      }

      res.status(404).send({
        msg: 'Telepresenca not found',
        code: 404,
        error: 'Not found',
      });
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }
}
