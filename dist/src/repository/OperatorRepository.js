"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Operator_1 = __importDefault(require("@src/models/Operator"));
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class OperatorRepository {
    async store(data) {
        try {
            const repository = typeorm_1.getRepository(Operator_1.default);
            const operator = await repository.create(data);
            await repository.save(operator);
            return operator;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async findByEmail(email) {
        try {
            const repository = typeorm_1.getRepository(Operator_1.default);
            const operator = await repository.findOne({ where: { email } });
            return operator;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getByID(id) {
        try {
            const repository = typeorm_1.getRepository(Operator_1.default);
            const operator = await repository.findOne({ where: { id } });
            return operator;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async findOne(data) {
        try {
            const repository = typeorm_1.getRepository(Operator_1.default);
            const operator = await repository.findOne({ where: data });
            return operator;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async forgotPassword(email) {
        try {
            const request = uuid_1.v4();
            const repository = typeorm_1.getRepository(Operator_1.default);
            const { affected } = await repository
                .createQueryBuilder()
                .update()
                .set({ request })
                .where('email = :email', { email })
                .execute();
            return !!affected;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async setForgotPassword(email, password) {
        try {
            const repository = typeorm_1.getRepository(Operator_1.default);
            const hashPassword = await bcryptjs_1.default.hashSync(password, 8);
            const { affected } = await repository
                .createQueryBuilder()
                .update()
                .set({ password: hashPassword, request: undefined })
                .where('email = :email', { email })
                .execute();
            return !!affected;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
}
exports.default = new OperatorRepository();
//# sourceMappingURL=OperatorRepository.js.map