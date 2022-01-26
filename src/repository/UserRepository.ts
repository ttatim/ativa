import User from '@src/models/User';
import { getRepository, RepositoryNotTreeError } from 'typeorm';

class UserRepository {
  public async getByEmailOrLogin(login: string): Promise<User | undefined> {
    try {
      const repository = getRepository(User);
      const result = await repository
        .createQueryBuilder()
        .where(`LOWER(login) = :login`, {
          login: login.toLowerCase(),
        })
        .orWhere(`LOWER(email) = :login`, {
          login: login.toLowerCase(),
        })
        .getOne();
      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getById(id: string): Promise<User | undefined> {
    try {
      const repository = getRepository(User);
      const result = await repository.findOne({ where: { id } });
      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async setPassoword(password: string, id: string): Promise<boolean> {
    try {
      const repository = getRepository(User);
      const { affected } = await repository
        .createQueryBuilder()
        .update()
        .set({ password })
        .where('id = :id', { id })
        .execute();

      return !!affected;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default new UserRepository();
