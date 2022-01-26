"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Telepresenca_1 = __importDefault(require("@src/models/Telepresenca"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class TelepresencaRepository {
    async store(data) {
        try {
            const repository = typeorm_1.getRepository(Telepresenca_1.default);
            const telepresenca = await repository.create(data);
            await repository.save(telepresenca);
            return telepresenca;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getByLogin(login) {
        try {
            const repository = typeorm_1.getRepository(Telepresenca_1.default);
            const result = await repository.findOne({ where: { login } });
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getById(id) {
        try {
            const repository = typeorm_1.getRepository(Telepresenca_1.default);
            const result = await repository.findOne({ where: { id } });
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getMany({ name = '', login = '', }) {
        try {
            const repository = typeorm_1.getRepository(Telepresenca_1.default);
            const result = await repository
                .createQueryBuilder()
                .where(`LOWER(name) LIKE :name And
          LOWER(login) LIKE :login`, {
                name: `%${name.toLowerCase()}%`,
                login: `%${login.toLowerCase()}%`,
            })
                .getMany();
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getWithPassword(login) {
        try {
            const repository = typeorm_1.getRepository(Telepresenca_1.default);
            const result = await repository
                .createQueryBuilder()
                .where('login = :login', { login })
                .getOne();
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async setPassword(id, password) {
        try {
            const repository = typeorm_1.getRepository(Telepresenca_1.default);
            const hashPassword = await bcryptjs_1.default.hashSync(password, 8);
            const { affected } = await repository
                .createQueryBuilder()
                .update()
                .set({ password: hashPassword })
                .where('id = :id', { id })
                .execute();
            return !!affected;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
}
exports.default = new TelepresencaRepository();
//# sourceMappingURL=TelepresencaRepository.js.map