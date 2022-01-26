"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("@src/models/User"));
const typeorm_1 = require("typeorm");
class UserRepository {
    async getByEmailOrLogin(login) {
        try {
            const repository = typeorm_1.getRepository(User_1.default);
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
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getById(id) {
        try {
            const repository = typeorm_1.getRepository(User_1.default);
            const result = await repository.findOne({ where: { id } });
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async setPassoword(password, id) {
        try {
            const repository = typeorm_1.getRepository(User_1.default);
            const { affected } = await repository
                .createQueryBuilder()
                .update()
                .set({ password })
                .where('id = :id', { id })
                .execute();
            return !!affected;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}
exports.default = new UserRepository();
//# sourceMappingURL=UserRepository.js.map