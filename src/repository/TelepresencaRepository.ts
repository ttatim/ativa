import { getRepository } from 'typeorm';
import Telepresenca from '@src/models/Telepresenca';
import bcryptjs from 'bcryptjs';

export interface TelepresencaStore {
  name: string;
  login: string;
  password?: string;
  create_at?: string;
  updated_at?: string;
  id?: string;
}

class TelepresencaRepository {
  public async store(
    data: TelepresencaStore
  ): Promise<Telepresenca | undefined> {
    try {
      const repository = getRepository(Telepresenca);
      const telepresenca = await repository.create(data);
      await repository.save(telepresenca);
      return telepresenca;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getByLogin(login: string): Promise<Telepresenca | undefined> {
    try {
      const repository = getRepository(Telepresenca);
      const result = await repository.findOne({ where: { login } });
      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getById(id: string): Promise<Telepresenca | undefined> {
    try {
      const repository = getRepository(Telepresenca);
      const result = await repository.findOne({ where: { id } });
      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getMany({
    name = '',
    login = '',
  }: {
    name: string;
    login: string;
  }): Promise<Telepresenca[] | undefined> {
    try {
      const repository = getRepository(Telepresenca);
      const result = await repository
        .createQueryBuilder()
        // .select(['name', 'login', 'created_at', 'updated_at', 'id'])
        .where(
          `LOWER(name) LIKE :name And
          LOWER(login) LIKE :login`,
          {
            name: `%${name.toLowerCase()}%`,
            login: `%${login.toLowerCase()}%`,
          }
        )
        .getMany();

      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getWithPassword(
    login: string
  ): Promise<Telepresenca | undefined> {
    try {
      const repository = getRepository(Telepresenca);
      const result = await repository
        .createQueryBuilder()
        .where('login = :login', { login })
        .getOne();

      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async setPassword(
    id: string,
    password: string
  ): Promise<boolean | undefined> {
    try {
      const repository = getRepository(Telepresenca);
      const hashPassword = await bcryptjs.hashSync(password, 8);
      const { affected } = await repository
        .createQueryBuilder()
        .update()
        .set({ password: hashPassword })
        .where('id = :id', { id })
        .execute();

      return !!affected;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}

export default new TelepresencaRepository();
