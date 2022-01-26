import AttendanceRoomRepository from '@src/repository/AttendanceRoomRepository';
import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import * as validator from '@src/middlewares/validators/attendanceRoom-validator';
import * as Authenticate from '@src/middlewares/services/AuthenticateService';
import ListOfAttendanceRoomMember, {
  TypeMember,
} from '@src/models/ListOfAttendanceRoomMember';

@Controller('attendanceRoom')
export class AttendanceRoom {
  @Post()
  @Middleware([Authenticate.authenticate, Authenticate.isMaster])
  @Middleware(validator.store)
  public async store(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const isAttendaceRoom = await AttendanceRoomRepository.getByName(name);
      if (isAttendaceRoom) {
        res.status(409).send({
          msg: 'Email already exists',
          code: 409,
          error: 'Conflit',
        });
        return;
      }
      const attendaceRoom = await AttendanceRoomRepository.store(name);
      if (!attendaceRoom) {
        res.status(500).send({
          msg: 'Falha internar',
          code: 500,
          error: 'Internal Server Error',
        });
        return;
      }

      res.status(201).send(attendaceRoom);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Get()
  @Middleware([Authenticate.authenticate, Authenticate.isMaster])
  public async getByName(req: Request, res: Response): Promise<void> {
    try {
      const name = req.query.name as string;
      const attendanceRooms = await AttendanceRoomRepository.getByNameMany(
        name
      );
      if (attendanceRooms) res.status(200).send(attendanceRooms);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: 'Falha internar',
        code: 500,
        error: 'Internal Server Error',
      });
    }
  }

  @Get(':id')
  @Middleware([Authenticate.authenticate, Authenticate.isOperator])
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params || '';
      const attendanceListWithMember = await AttendanceRoomRepository.getByIdWithMember(
        id
      );
      if (!attendanceListWithMember) {
        res.status(200).send([]);
        return;
      }
      const members = attendanceListWithMember?.members || [];
      const prettyAttendanceListWithMember = {
        ...attendanceListWithMember,
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
}

export function prettyMemberList(list: ListOfAttendanceRoomMember[]) {
  return list.map((element) => {
    const id_member =
      element.type === TypeMember.OPERATOR
        ? element.id_member_operator
        : element.id_member_telepresenca;
    const { createdAt, updatedAt, id, type, name } = element;
    return {
      id_member,
      type,
      createdAt,
      updatedAt,
      id,
      name,
    };
  });
}
