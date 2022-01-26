import TelepresencaRepository from '@src/repository/TelepresencaRepository';
import { getRepository } from 'typeorm';
import Telepresenca from '@src/models/Telepresenca';
import Operator from '@src/models/Operator';
import User from '@src/models/User';
import jwt from 'jsonwebtoken';
import AttendanceRoomRepository from '@src/repository/AttendanceRoomRepository';
import ListOfAttendanceRoomMemberRepository from '@src/repository/ListOfAttendanceRoomMemberRepository';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';
import AttendanceRoom from '@src/models/AttendanceRoom';

const operator = {
  name: 'John Green',
  email: 'john.green@email.com',
  password: '123456',
};
describe('Telepresenca functional test', () => {
  let token: string;
  beforeEach(async () => {
    await getRepository(Telepresenca).createQueryBuilder().delete().execute();
    await getRepository(Operator).createQueryBuilder().delete().execute();
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { login: 'admin' } });
    if (!user) return;
    token = await jwt.sign({ id: user.id }, process.env.TOKEN || 'ola');
  });

  const newTelepresenca = {
    name: 'Telepresença Hall',
    login: 'Telepresenca.Hall',
    password: '123456',
  };
  describe('When create telepresenca', () => {
    it('should not create when user is not logged', async () => {
      const { status, body } = await global.testRequest
        .post('/telepresenca')
        .send(newTelepresenca);

      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: 'Unauthorized',
        msg: 'Restricted access',
      });
    });

    it('should create a new telepresença', async () => {
      const { status, body } = await global.testRequest
        .post('/telepresenca')
        .set({ 'x-access-token': token })
        .send(newTelepresenca);

      expect(status).toBe(201);
      expect(body).toEqual(
        expect.objectContaining({
          name: 'Telepresença Hall',
          login: 'Telepresenca.Hall',
        })
      );
    });

    it('should not create when the telepresença already exists', async () => {
      await TelepresencaRepository.store(newTelepresenca);

      const { status, body } = await global.testRequest
        .post('/telepresenca')
        .set({ 'x-access-token': token })
        .send(newTelepresenca);

      expect(status).toBe(409);
      expect(body).toEqual({
        msg: 'Login already exists',
        code: 409,
        error: 'Conflit',
      });
    });

    it('should not create when field is invalid', async () => {
      const { status, body } = await global.testRequest
        .post('/telepresenca')
        .set({ 'x-access-token': token })
        .send({
          name: 'Telepresença Hall',
          login: 'Telepresenca.Hall',
          // password: '123456', => invalid field
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

  describe('When find telepresenca', () => {
    it('should find a telepresenca by id', async () => {
      const telepresencaRepository = getRepository(Telepresenca);
      const getTelepresenca = await telepresencaRepository.create(
        newTelepresenca
      );
      await telepresencaRepository.save(getTelepresenca);

      const { status, body } = await global.testRequest
        .get(`/telepresenca/${getTelepresenca.id}`)
        .set({ 'x-access-token': token })
        .send();
      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          login: 'Telepresenca.Hall',
          name: 'Telepresença Hall',
        })
      );
    });

    it('should return error 404 when telepresenca not found by id', async () => {
      const telepresencaRepository = getRepository(Telepresenca);
      const getTelepresenca = await telepresencaRepository.create(
        newTelepresenca
      );
      await telepresencaRepository.save(getTelepresenca);

      const { status, body } = await global.testRequest
        .get(`/telepresenca/invalid-type-uuid`)
        .set({ 'x-access-token': token })
        .send();
      expect(status).toBe(400);
      expect(body).toEqual({
        errors: [
          {
            location: 'params',
            msg: 'ID is not uuid',
            param: 'id',
            value: 'invalid-type-uuid',
          },
        ],
      });
    });

    it('should return many telepresenca', async () => {
      const telepresencaRepository = getRepository(Telepresenca);
      const getTelepresenca = await telepresencaRepository.create(
        newTelepresenca
      );
      await telepresencaRepository.save(getTelepresenca);

      const { status, body } = await global.testRequest
        .get(`/telepresenca`)
        .set({ 'x-access-token': token })
        .send();
      expect(status).toBe(200);
      expect(body.length).toBe(1);
    });
  });
  describe('When authenticate telepresenca', () => {
    it('should athenticate telepresenca and return the token', async () => {
      await TelepresencaRepository.store(newTelepresenca);

      const { status, body } = await global.testRequest
        .post('/telepresenca/signin')
        .send({
          login: 'Telepresenca.Hall',
          password: '123456',
        });

      expect(status).toBe(200);
      expect(body).toEqual({
        data: expect.objectContaining({
          login: 'Telepresenca.Hall',
          name: 'Telepresença Hall',
        }),
        token: expect.any(String),
      });
    });
    it('should not athenticate telepresenca when password or login are invalid', async () => {
      await TelepresencaRepository.store(newTelepresenca);

      const { status, body } = await global.testRequest
        .post('/telepresenca/signin')
        .send({
          login: 'Telepresenca.Hall',
          password: '12346',
        });

      expect(status).toBe(404);
      expect(body).toEqual({
        error: 'Not found',
        code: 404,
        msg: 'Login or password invalid',
      });
    });
    it('should not athenticate telepresenca when field is invalid', async () => {
      await TelepresencaRepository.store(newTelepresenca);

      const { status, body } = await global.testRequest
        .post('/telepresenca/signin')
        .send({
          login: 'Telepresenca.Hall',
          // password: '12346', => Invalid field
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

  describe('Check token', () => {
    it('should return new token, when token is valid', async () => {
      const repositoryTelepresenca = await getRepository(Telepresenca);
      const tele = repositoryTelepresenca.create(newTelepresenca);
      await repositoryTelepresenca.save(tele);

      const telToken = await jwt.sign(
        { id: tele.id },
        process.env.TOKEN || 'ola'
      );
      const { status, body } = await global.testRequest
        .get('/telepresenca/checkMe')
        .set({ 'x-access-token': telToken })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual({
        data: {
          id: tele.id,
          login: tele.login,
          name: tele.name,
        },
        token: expect.any(String),
      });
    });
  });

  describe('Get Room', () => {
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
    it('should return info room', async () => {
      const telepresenca = await TelepresencaRepository.store(newTelepresenca);
      const newAttendanceRoom = await AttendanceRoomRepository.store('Room');
      const newMember = {
        id_attendanceRoom: newAttendanceRoom?.id,
        id_member_telepresenca: telepresenca?.id,
        type: 'telepresenca',
        name: telepresenca?.name,
      };
      await ListOfAttendanceRoomMemberRepository.store(
        newMember as ListOfAttendanceRoomMember
      );
      const telToken = await jwt.sign(
        { id: telepresenca?.id },
        process.env.TOKEN || 'ola'
      );

      const { status, body } = await global.testRequest
        .get(`/telepresenca/room`)
        .set({ 'x-access-token': telToken })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual(expect.objectContaining(newMember));
    });
  });
});
