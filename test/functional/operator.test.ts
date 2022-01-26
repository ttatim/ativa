import Operator from '@src/models/Operator';
import User from '@src/models/User';
import { getRepository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import jwt from 'jsonwebtoken';
import AttendanceRoomRepository from '@src/repository/AttendanceRoomRepository';
import OperatorRepository from '@src/repository/OperatorRepository';
import ListOfAttendanceRoomMemberRepository from '@src/repository/ListOfAttendanceRoomMemberRepository';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';
import AttendanceRoom from '@src/models/AttendanceRoom';

describe('Operator functional test', () => {
  let token: string;
  beforeEach(async () => {
    await getRepository(Operator).createQueryBuilder().delete().execute();
    const operatoRepository = getRepository(User);
    const user = await operatoRepository.findOne({ where: { login: 'admin' } });
    if (!user) return;
    token = await jwt.sign({ id: user.id }, process.env.TOKEN || 'ola');
  });
  const operator = {
    name: 'John Green',
    email: 'john.green@email.com',
    password: '123456',
  };
  describe('When create Operator', () => {
    it('should not create when user is not logged', async () => {
      const { status, body } = await global.testRequest
        .post('/operator')
        .send(operator);

      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: 'Unauthorized',
        msg: 'Restricted access',
      });
    });
    it('should create a new operator', async () => {
      const { status, body } = await global.testRequest
        .post('/operator')
        .set({ 'x-access-token': token })
        .send(operator);

      expect(status).toBe(201);
      expect(body).toEqual(
        expect.objectContaining({
          name: 'John Green',
          email: 'john.green@email.com',
        })
      );
    });

    it('should not create a operator when field is invalid', async () => {
      const { status, body } = await global.testRequest
        .post('/operator')
        .set({ 'x-access-token': token })
        .send({
          name: 'John Green',
          // email: 'john.green@email.com',  => invalid field
          password: '123456',
        });

      expect(status).toBe(400);
      expect(body).toEqual({
        errors: [
          { location: 'body', msg: 'Email cannot be empty', param: 'email' },
        ],
      });
    });

    it('should not create when a email already exist', async () => {
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create(operator);
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .post('/operator')
        .set({ 'x-access-token': token })
        .send(operator);

      expect(status).toBe(409);
      expect(body).toEqual({
        msg: 'Email already exists',
        code: 409,
        error: 'Conflit',
      });
    });
  });

  describe('When authentication a operator', () => {
    it('should authentication a operator', async () => {
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create(operator);
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .post('/operator/signin')
        .send({
          email: 'john.green@email.com',
          password: '123456',
        });

      expect(status).toBe(200);
      expect(body).toEqual({
        operator: expect.objectContaining({
          name: 'John Green',
          email: 'john.green@email.com',
        }),
        token: expect.any(String),
      });
    });

    it('should not authentication a operator when password is invalid', async () => {
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create(operator);
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .post('/operator/signin')
        .send({
          email: 'john.green@email.com',
          password: '12345',
        });

      expect(status).toBe(401);
      expect(body).toEqual({
        msg: `Unauthorized access`,
        code: 401,
        error: 'Unauthorized',
      });
    });

    it('should not authentication operator when field is invalid', async () => {
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create(operator);
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .post('/operator/signin')
        .send({
          email: 'john.green@email.com',
          // password: '12345', => invalid field
        });

      expect(status).toBe(400);
      expect(body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Password cannot be empty',
            param: 'password',
          },
        ],
      });
    });
  });

  describe('when forgot password', () => {
    it('should request a new password', async () => {
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create(operator);
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .post('/operator/forgotPassword')
        .send({
          email: 'john.green@email.com',
        });

      expect(status).toBe(201);
      expect(body).toEqual({
        msg: 'Request success',
      });
    });

    it('should not request a new password when email is not found', async () => {
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create(operator);
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .post('/operator/forgotPassword')
        .send({
          email: 'john@email.com',
        });

      expect(status).toBe(404);
      expect(body).toEqual({
        code: 404,
        msg: 'Email not found',
        error: 'Not Found',
      });
    });

    it('should not request a new password when the email field is invalid', async () => {
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create(operator);
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .post('/operator/forgotPassword')
        .send({
          // email: 'john@email.com', => invalid field
        });

      expect(status).toBe(400);
      expect(body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Email cannot be empty',
            param: 'email',
          },
        ],
      });
    });
  });

  describe('When the operation set a new password', () => {
    it('should set a new passowrd', async () => {
      const request = uuidV4();
      const operatorRepository = getRepository(Operator);
      const newOperator = await operatorRepository.create({
        ...operator,
        request,
      });
      await operatorRepository.save(newOperator);

      const { status, body } = await global.testRequest
        .put('/operator/forgotPassword')
        .send({
          email: operator.email,
          request,
          password: '654321',
        });

      expect(status).toBe(200);
      expect(body).toEqual({ msg: 'Request Success' });
    });
  });

  describe('Check token', () => {
    it('should return new token, when token is valid', async () => {
      const repositoryOperato = await getRepository(Operator);
      const _operator = repositoryOperato.create(operator);
      await repositoryOperato.save(_operator);

      const telToken = await jwt.sign(
        { id: _operator.id },
        process.env.TOKEN || 'ola'
      );
      const { status, body } = await global.testRequest
        .get('/operator/checkMe')
        .set({ 'x-access-token': telToken })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual({
        operator: expect.objectContaining({
          name: 'John Green',
          email: 'john.green@email.com',
        }),
        token: expect.any(String),
      });
    });
  });

  describe('When find room', () => {
    beforeEach(async () => {
      await getRepository(AttendanceRoom)
        .createQueryBuilder()
        .delete()
        .execute();
      await getRepository(ListOfAttendanceRoomMember)
        .createQueryBuilder()
        .delete()
        .execute();
    });
    it('should return rooms by athenticate operator', async () => {
      const name = 'Posto 1';
      const newAttendanceRoom = await AttendanceRoomRepository.store(name);
      const newOperator = await OperatorRepository.store(operator as Operator);
      const newMember = {
        id_attendanceRoom: newAttendanceRoom?.id,
        id_member_operator: newOperator?.id,
        type: 'operator',
        name: newOperator?.name,
      };
      await ListOfAttendanceRoomMemberRepository.store(
        newMember as ListOfAttendanceRoomMember
      );

      const operatorToken = await jwt.sign(
        { id: newOperator?.id },
        process.env.TOKEN || 'olá'
      );

      const { status, body } = await global.testRequest
        .get('/operator/room')
        .set({ 'x-access-token': operatorToken })
        .send();

      expect(status).toBe(200);
      // expect(body).toEqual({});
    });

    it('should return error 401 when does not operator athenticate', async () => {
      const { status, body } = await global.testRequest
        .get('/operator/room')
        .send();

      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: 'Unauthorized',
        msg: 'Restricted access',
      });
    });

    it('should return error 404 when operator does not have Attendance Room ', async () => {
      const newOperator = await OperatorRepository.store(operator as Operator);
      const operatorToken = await jwt.sign(
        { id: newOperator?.id },
        process.env.TOKEN || 'olá'
      );

      const { status, body } = await global.testRequest
        .get('/operator/room')
        .set({ 'x-access-token': operatorToken })
        .send();

      expect(status).toBe(404);
      expect(body).toEqual({
        code: 404,
        error: 'Not Found',
        msg: 'Attendance Room not found',
      });
    });
  });
});
