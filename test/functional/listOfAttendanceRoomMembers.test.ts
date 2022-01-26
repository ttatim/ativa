import { getRepository } from 'typeorm';
import User from '@src/models/User';
import jwt from 'jsonwebtoken';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';
import OperatorRepository from '@src/repository/OperatorRepository';
import Operator from '@src/models/Operator';
import AttendanceRoomRepository from '@src/repository/AttendanceRoomRepository';
import AttendanceRoom from '@src/models/AttendanceRoom';
import Telepresenca from '@src/models/Telepresenca';
import ListOfAttendanceRoomMemberRepository from '@src/repository/ListOfAttendanceRoomMemberRepository';

describe('List of Attendance Room Members functional test', () => {
  let token = '';
  const operator = {
    name: 'John Green',
    email: 'john.green@email.com',
    password: '123456',
  };
  const telepresenca = {
    name: 'Tela',
    login: 'Tela.1',
    password: '123456',
  };
  const attendaceRoom = { name: 'Posto' };
  beforeEach(async () => {
    await getRepository(ListOfAttendanceRoomMember)
      .createQueryBuilder()
      .delete()
      .execute();
    await getRepository(AttendanceRoom).createQueryBuilder().delete().execute();
    await getRepository(Operator).createQueryBuilder().delete().execute();
    await getRepository(Telepresenca).createQueryBuilder().delete().execute();
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { login: 'admin' } });
    if (!user) return;
    token = await jwt.sign({ id: user.id }, process.env.TOKEN || 'ola');
  });
  describe('When create member', () => {
    it('should not create member, when user does not authenticate', async () => {
      const newOperator = await OperatorRepository.store(operator as Operator);
      const newAttendanceRoom = await AttendanceRoomRepository.store(
        attendaceRoom.name
      );
      const { status, body } = await global.testRequest
        .post('/listOfAttendanceRoomMember')
        .send({
          id_attandanceRoom: newAttendanceRoom?.id,
          id_operator: newOperator?.id,
          type: 'operator',
        });

      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: 'Unauthorized',
        msg: 'Restricted access',
      });
    });

    it('should create members', async () => {
      const newOperator = await OperatorRepository.store(operator as Operator);
      const newAttendanceRoom = await AttendanceRoomRepository.store(
        attendaceRoom.name
      );
      const { status, body } = await global.testRequest
        .post('/listOfAttendanceRoomMember')
        .set({ 'x-access-token': token })
        .send({
          id_attendanceRoom: newAttendanceRoom?.id,
          id_member_operator: newOperator?.id,
          type: 'operator',
        });

      expect(status).toBe(201);
      expect(body).toEqual(
        expect.objectContaining({
          id_attendanceRoom: newAttendanceRoom?.id,
          id_member_operator: newOperator?.id,
          type: 'operator',
        })
      );
    });

    it('should not create, when Attendance Room does not exists', async () => {
      const newOperator = await OperatorRepository.store(operator as Operator);
      const { status, body } = await global.testRequest
        .post('/listOfAttendanceRoomMember')
        .set({ 'x-access-token': token })
        .send({
          id_attendanceRoom: 'invalid',
          id_member_operator: newOperator?.id,
          type: 'operator',
        });

      expect(status).toBe(404);
      expect(body).toEqual({
        error: 'Not Found',
        msg: 'Attendance Room not found',
        code: 404,
      });
    });
    it('should not create, when operator does not exists', async () => {
      const newAttendanceRoom = await AttendanceRoomRepository.store(
        attendaceRoom.name
      );
      const { status, body } = await global.testRequest
        .post('/listOfAttendanceRoomMember')
        .set({ 'x-access-token': token })
        .send({
          id_attendanceRoom: newAttendanceRoom?.id,
          id_member_operator: 'invalid',
          type: 'operator',
        });

      expect(status).toBe(404);
      expect(body).toEqual({
        error: 'Not Found',
        msg: 'Member not found',
        code: 404,
      });
    });
    it('should not create, when fileds are invalid', async () => {
      const newAttendanceRoom = await AttendanceRoomRepository.store(
        attendaceRoom.name
      );
      const { status, body } = await global.testRequest
        .post('/listOfAttendanceRoomMember')
        .set({ 'x-access-token': token })
        .send({
          id_attendanceRoom: newAttendanceRoom?.id,
          type: 'operator',
          // id_member_operator: 'invalid', => invalid field
        });

      expect(status).toBe(400);
    });
  });

  describe('When remove member', () => {
    it('should not remove when user is not authenticate', async () => {
      const newOperator = await OperatorRepository.store(operator as Operator);
      const newAttendanceRoom = await AttendanceRoomRepository.store(
        attendaceRoom.name
      );
      const newMember = {
        id_attendanceRoom: newAttendanceRoom?.id,
        id_member_operator: newOperator?.id,
        type: 'operator',
      };
      const itemListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository.store(
        newMember as ListOfAttendanceRoomMember
      );

      const { status, body } = await global.testRequest
        .delete(
          `/listOfAttendanceRoomMember/${itemListOfAttendanceRoomMember?.id}`
        )
        .send();

      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: 'Unauthorized',
        msg: 'Restricted access',
      });
    });

    it('should remove member', async () => {
      const newOperator = await OperatorRepository.store(operator as Operator);
      const newAttendanceRoom = await AttendanceRoomRepository.store(
        attendaceRoom.name
      );
      const newMember = {
        id_attendanceRoom: newAttendanceRoom?.id,
        id_member_operator: newOperator?.id,
        type: 'operator',
      };
      const itemListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository.store(
        newMember as ListOfAttendanceRoomMember
      );

      const { status, body } = await global.testRequest
        .delete(
          `/listOfAttendanceRoomMember/${itemListOfAttendanceRoomMember?.id}`
        )
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual({
        msg: 'Request successful',
      });
    });

    it('should return error 404 when member not found', async () => {
      const newOperator = await OperatorRepository.store(operator as Operator);
      const newAttendanceRoom = await AttendanceRoomRepository.store(
        attendaceRoom.name
      );
      const newMember = {
        id_attendanceRoom: newAttendanceRoom?.id,
        id_member_operator: newOperator?.id,
        type: 'operator',
      };
      await ListOfAttendanceRoomMemberRepository.store(
        newMember as ListOfAttendanceRoomMember
      );

      const { status, body } = await global.testRequest
        .delete(`/listOfAttendanceRoomMember/345de-fferr-ddd'}`)
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(404);
      expect(body).toEqual({
        error: 'Not Found',
        code: 404,
        msg: 'Member not found',
      });
    });
  });
});
