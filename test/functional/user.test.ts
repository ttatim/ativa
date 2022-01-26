import { getRepository } from 'typeorm';
import User from '@src/models/User';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

describe('User functional test', () => {
  describe('When login user master', () => {
    it('should return token when autheticate', async () => {
      const { status, body } = await global.testRequest
        .post('/user/signin')
        .send({
          login: 'admin',
          password: 'EBSVision.76',
        });

      expect(status).toBe(200);
      expect(body).toEqual({
        data: expect.objectContaining({
          name: 'admin',
        }),
        token: expect.any(String),
      });
    });
    it('should return error 400 when field is invalid', async () => {
      const { status, body } = await global.testRequest
        .post('/user/signin')
        .send({
          login: 'admin',
          // password: 'EBSVision.76', => invalid field
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
    it('should return error 401 when passowrd or login invalid', async () => {
      const { status, body } = await global.testRequest
        .post('/user/signin')
        .send({
          login: 'admin',
          password: 'admin',
        });

      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: 'Unauthorized',
        msg: 'Unauthorized access',
      });
    });
  });

  describe('When user set password', () => {
    it('should set new password', async () => {
      const user = await getRepository(User).findOne({
        where: { login: 'admin' },
      });

      if (!user) {
        return;
      }
      const token = await jwt.sign({ id: user.id }, process.env.TOKEN || 'ola');
      const { status, body } = await global.testRequest
        .put('/user/password')
        .set({ 'x-access-token': token })
        .send({
          old_password: 'EBSVision.76',
          new_password: 'EBSVision',
        });

      expect(status).toBe(200);
      expect(body).toEqual({ msg: 'Successful process' });
      const password = await bcryptjs.hashSync('EBSVision.76', 8);
      await getRepository(User)
        .createQueryBuilder()
        .update()
        .set({ password })
        .where('id = :id', { id: user.id })
        .execute();
    });
    it('should not set new password when field is invalid', async () => {
      const user = await getRepository(User).findOne({
        where: { login: 'admin' },
      });

      if (!user) {
        return;
      }
      const token = await jwt.sign({ id: user.id }, process.env.TOKEN || 'ola');

      const { status, body } = await global.testRequest
        .put('/user/password')
        .set({ 'x-access-token': token })
        .send({
          old_password: 'EBSVision.76',
          // new_password: 'EBSVision', => invalid field
        });

      expect(status).toBe(400);
      expect(body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'New password cannot be empty',
            param: 'new_password',
          },
        ],
      });
    });
  });
});
