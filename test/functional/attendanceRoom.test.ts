import AttendanceRoom from '@src/models/AttendanceRoom';
import User from '@src/models/User';
import Operator from '@src/models/Operator';
import AttendanceRoomRepository from '@src/repository/AttendanceRoomRepository';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import OperatorRepository from '@src/repository/OperatorRepository';
import ListOfAttendanceRoomMemberRepository from '@src/repository/ListOfAttendanceRoomMemberRepository';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';

describe('Attendance Room functional test', () => {
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
  beforeEach(async () => {
    await getRepository(AttendanceRoom).createQueryBuilder().delete().execute();
    const operatoRepository = getRepository(User);
    const user = await operatoRepository.findOne({ where: { login: 'admin' } });
    if (!user) return;
    token = await jwt.sign({ id: user.id }, process.env.TOKEN || 'ola');
  });
  describe('When create Attendance Room', () => {
    it('should not create attendance room when admin does not authenticated', async () => {
      const { status, body } = await global.testRequest
        .post('/attendanceRoom')
        .send({ name: 'Posto 1' });

      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: 'Unauthorized',
        msg: 'Restricted access',
      });
    });

    it('should create Attendance room', async () => {
      const { status, body } = await global.testRequest
        .post('/attendanceRoom')
        .set({ 'x-access-token': token })
        .send({
          name: 'Posto 1',
        });

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining({ name: 'Posto 1' }));
    });

    it('should not create Attendance Room when already exists', async () => {
      const name = 'Posto 1';
      await AttendanceRoomRepository.store(name);
      const { status, body } = await global.testRequest
        .post('/attendanceRoom')
        .set({ 'x-access-token': token })
        .send({ name });

      expect(status).toBe(409);
      expect(body).toEqual({
        msg: 'Email already exists',
        code: 409,
        error: 'Conflit',
      });
    });

    it('should not create when name is undefined', async () => {
      const { status, body } = await global.testRequest
        .post('/attendanceRoom')
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(400);
      expect(body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Name cannot be empty',
            param: 'name',
          },
        ],
      });
    });
  });

  describe('Find Atteandance Room', () => {
    beforeEach(async () => {
      await getRepository(Operator).createQueryBuilder().delete().execute();
      await getRepository(ListOfAttendanceRoomMember)
        .createQueryBuilder()
        .delete()
        .execute();
    });
    it('should not return attendance rooms when admin does not authenticated', async () => {
      const { status, body } = await global.testRequest
        .get(`/attendanceRoom?name=Po`)
        .send();

      expect(status).toBe(401);
    });
    it('should return attendance room', async () => {
      const name = 'Posto 1';
      await AttendanceRoomRepository.store(name);
      const { status, body } = await global.testRequest
        .get(`/attendanceRoom?name=Po`)
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual([expect.objectContaining({ name })]);
    });

    it('should return attendance room by id with member when operator was athenticate', async () => {
      const name = 'Posto 1';
      const newAttendanceRoom = await AttendanceRoomRepository.store(name);
      const newOperator = await OperatorRepository.store(operator as Operator);
      const newMember = {
        id_attendanceRoom: newAttendanceRoom?.id,
        id_member_operator: newOperator?.id,
        type: 'operator',
      };
      await ListOfAttendanceRoomMemberRepository.store(
        newMember as ListOfAttendanceRoomMember
      );
      const operatorToken = await jwt.sign(
        { id: newOperator?.id },
        process.env.TOKEN || 'ola'
      );
      const { status, body } = await global.testRequest
        .get(`/attendanceRoom/${newAttendanceRoom?.id}`)
        .set({ 'x-access-token': operatorToken })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          id: newAttendanceRoom?.id,
        })
      );
    });
  });
});
