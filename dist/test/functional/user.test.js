"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("@src/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
            const user = await typeorm_1.getRepository(User_1.default).findOne({
                where: { login: 'admin' },
            });
            if (!user) {
                return;
            }
            const token = await jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN || 'ola');
            const { status, body } = await global.testRequest
                .put('/user/password')
                .set({ 'x-access-token': token })
                .send({
                old_password: 'EBSVision.76',
                new_password: 'EBSVision',
            });
            expect(status).toBe(200);
            expect(body).toEqual({ msg: 'Successful process' });
            const password = await bcryptjs_1.default.hashSync('EBSVision.76', 8);
            await typeorm_1.getRepository(User_1.default)
                .createQueryBuilder()
                .update()
                .set({ password })
                .where('id = :id', { id: user.id })
                .execute();
        });
        it('should not set new password when field is invalid', async () => {
            const user = await typeorm_1.getRepository(User_1.default).findOne({
                where: { login: 'admin' },
            });
            if (!user) {
                return;
            }
            const token = await jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN || 'ola');
            const { status, body } = await global.testRequest
                .put('/user/password')
                .set({ 'x-access-token': token })
                .send({
                old_password: 'EBSVision.76',
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
//# sourceMappingURL=user.test.js.map