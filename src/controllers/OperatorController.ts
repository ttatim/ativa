import { Controller, Middleware, Post, Put, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import OperatorRepository from '@src/repository/OperatorRepository';
import Operator from '@src/models/Operator';
import * as Validator from '@src/middlewares/validators/operator-validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as AuthService from '@src/middlewares/services/AuthenticateService';
import AttendanceRoomRepository from '@src/repository/AttendanceRoomRepository';
import ListOfAttendanceRoomMemberRepository from '@src/repository/ListOfAttendanceRoomMemberRepository';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';
import { prettyMemberList } from '@src/controllers/AttendanceRoomController';

@Controller('operator')
export class OperatorController {
  @Post()
  @Middleware(AuthService.authenticate)
  @Middleware(AuthService.isMaster)
  @Middleware(Validator.store)
  public async store(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const alreadyExist = await OperatorRepository.findByEmail(email);
    if (alreadyExist) {
      res.status(409).send({
        msg: 'Email already exists',
        code: 409,
        error: 'Conflit',
      });
      return;
    }

    const result = await OperatorRepository.store({
      name,
      email,
      password,
    } as Operator);
    res.status(201).send({ ...result, password: undefined });
  }

  @Post('signin')
  @Middleware(Validator.authenticate)
  public async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      let operator = await OperatorRepository.findOne({ email });
      if (!operator) {
        res.status(401).send({
          msg: `Unauthorized access`,
          code: 401,
          error: 'Unauthorized',
        });
        return;
      }

      const isValidPassword = await bcryptjs.compare(
        password,
        operator.password
      );
      if (!isValidPassword) {
        res.status(401).send({
          msg: `Unauthorized access`,
          code: 401,
          error: 'Unauthorized',
        });
        return;
      }

      const token = await jwt.sign(
        { id: operator.id },
        process.env.TOKEN || 'ola',
        { expiresIn: '1h' }
      );
      res.status(200).send({
        operator: { ...operator, password: undefined },
        token,
      });
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Post('forgotPassword')
  @Middleware(Validator.forgotPassword)
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const isRequested = await OperatorRepository.forgotPassword(email);
      if (isRequested) {
        res.status(201).send({
          msg: 'Request success',
        });
      } else {
        res.status(404).send({
          code: 404,
          msg: 'Email not found',
          error: 'Not Found',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Put('forgotPassword')
  public async setForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { request, email, password } = req.body;
      const operator = await OperatorRepository.findByEmail(email);

      if (!operator) {
        res.status(404).send({
          msg: 'Email not found',
          code: 404,
          error: 'Not Found',
        });
        return;
      }
      if (!operator.request || operator.request !== request) {
        res.status(404).send({
          msg: 'Request not found',
          code: 404,
          error: 'Not Found',
        });
        return;
      }

      const isSetForgotPassowrd = await OperatorRepository.setForgotPassword(
        email,
        password
      );
      if (isSetForgotPassowrd) {
        res.status(200).send({ msg: 'Request Success' });
        return;
      }

      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Get('room')
  @Middleware([AuthService.authenticate, AuthService.isOperator])
  public async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const id = req.decoded.id || '';
      const isMemberOfAnyListOfAttendance = await ListOfAttendanceRoomMemberRepository.findOne(
        { id_member_operator: id } as ListOfAttendanceRoomMember
      );

      if (!isMemberOfAnyListOfAttendance) {
        res.status(404).send({
          code: 404,
          error: 'Not Found',
          msg: 'Attendance Room not found',
        });
        return;
      }

      const attendanceRoomWithMembers = await AttendanceRoomRepository.getByIdWithMember(
        isMemberOfAnyListOfAttendance.id_attendanceRoom
      );

      if (!attendanceRoomWithMembers) {
        res.status(404).send({
          code: 404,
          error: 'Not Found',
          msg: 'Attendance Room not found',
        });
        return;
      }
      const members = attendanceRoomWithMembers?.members || [];
      const prettyAttendanceListWithMember = {
        ...attendanceRoomWithMembers,
        members: prettyMemberList(members),
      };

      res.status(200).send(prettyAttendanceListWithMember);
    } catch (err) {
      console.log(err);
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
    const operator = await OperatorRepository.getByID(id);

    if (!operator) {
      res.status(401).send({
        msg: 'Restricted access',
        code: 401,
        error: 'Unauthorized',
      });
      return;
    }
    const token = await jwt.sign(
      { id: operator.id },
      process.env.TOKEN || 'ola',
      { expiresIn: '1h' }
    );
    res.status(200).send({
      operator: { ...operator, password: undefined },
      token,
    });
  }
}
