import { Controller, Delete, Get, Middleware, Post } from '@overnightjs/core';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';
import ListOfAttendanceRoomMemberRepository from '@src/repository/ListOfAttendanceRoomMemberRepository';
import { Request, Response } from 'express';
import * as AuthenticateService from '@src/middlewares/services/AuthenticateService';
import TelepresencaRepository from '@src/repository/TelepresencaRepository';
import OperatorRepository from '@src/repository/OperatorRepository';
import * as validator from '@src/middlewares/validators/listOfAttendanceRoomMember';
import AttendanceRoomRepository from '@src/repository/AttendanceRoomRepository';

@Controller('listOfAttendanceRoomMember')
export class ListOfAttendanceRoomMemberController {
  @Post()
  @Middleware([AuthenticateService.authenticate, AuthenticateService.isMaster])
  @Middleware(validator.store)
  public async store(req: Request, res: Response): Promise<void> {
    try {
      const data: ListOfAttendanceRoomMember = req.body;
      const isListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository.findOne(
        data
      );
      if (isListOfAttendanceRoomMember) {
        res.status(409).send({
          msg: 'Member already exists',
          erro: 'Conflict',
          code: 409,
        });

        return;
      }

      const isAttendanceRooom = await AttendanceRoomRepository.getById(
        data.id_attendanceRoom
      );
      if (!isAttendanceRooom) {
        res.status(404).send({
          msg: 'Attendance Room not found',
          code: 404,
          error: 'Not Found',
        });
        return;
      }

      let isMember;
      if (data.type === 'operator') {
        isMember = await OperatorRepository.getByID(data.id_member_operator);
      } else {
        isMember = await TelepresencaRepository.getById(
          data.id_member_telepresenca
        );
      }

      if (!isMember) {
        res.status(404).send({
          msg: 'Member not found',
          code: 404,
          error: 'Not Found',
        });
        return;
      }

      const itemListOfAttendanceRoomMember: ListOfAttendanceRoomMember = {
        ...data,
        name: isMember.name,
      };
      const result = await ListOfAttendanceRoomMemberRepository.store(
        itemListOfAttendanceRoomMember
      );

      if (!result) {
        res.status(500).send({
          msg: 'Falha internar',
          code: 500,
          error: 'Internal Server Error',
        });
        return;
      }

      res.status(201).send(result);
    } catch (err) {
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Delete(':id')
  @Middleware([AuthenticateService.authenticate, AuthenticateService.isMaster])
  public async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ListOfAttendanceRoomMemberRepository.remove(id);
      if (!result) {
        res.status(404).send({
          error: 'Not Found',
          code: 404,
          msg: 'Member not found',
        });
        return;
      }

      res.status(200).send({
        msg: 'Request successful',
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
