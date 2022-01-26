import Operator from '@src/models/Operator';
import { getRepository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import bcryptjs from 'bcryptjs';

class OperatorRepository {
  public async store(data: Operator): Promise<Operator | undefined> {
    try {
      const repository = getRepository(Operator);
      const operator = await repository.create(data);
      await repository.save(operator);
      return operator;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async findByEmail(email: string): Promise<Operator | undefined> {
    try {
      const repository = getRepository(Operator);
      const operator = await repository.findOne({ where: { email } });
      return operator;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getByID(id: string): Promise<Operator | undefined> {
    try {
      const repository = getRepository(Operator);
      const operator = await repository.findOne({ where: { id } });
      return operator;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async findOne(data: {
    name?: string;
    email?: string;
  }): Promise<Operator | undefined> {
    try {
      const repository = getRepository(Operator);
      const operator = await repository.findOne({ where: data });
      return operator;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }


  public async forgotPassword(email: string): Promise<boolean | undefined> {
    try {
      const request = uuidV4();
      const repository = getRepository(Operator);
      const { affected } = await repository
        .createQueryBuilder()
        .update()
        .set({ request })
        .where('email = :email', { email })
        .execute();

      return !!affected;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async setForgotPassword(
    email: string,
    password: string
  ): Promise<boolean | undefined> {
    try {
      const repository = getRepository(Operator);
      const hashPassword = await bcryptjs.hashSync(password, 8);
      const { affected } = await repository
        .createQueryBuilder()
        .update()
        .set({ password: hashPassword, request: undefined })
        .where('email = :email', { email })
        .execute();

      return !!affected;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}

export default new OperatorRepository();
