"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Operator_1 = __importDefault(require("@src/models/Operator"));
const User_1 = __importDefault(require("@src/models/User"));
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AttendanceRoomRepository_1 = __importDefault(require("@src/repository/AttendanceRoomRepository"));
const OperatorRepository_1 = __importDefault(require("@src/repository/OperatorRepository"));
const ListOfAttendanceRoomMemberRepository_1 = __importDefault(require("@src/repository/ListOfAttendanceRoomMemberRepository"));
const ListOfAttendanceRoomMember_1 = __importDefault(require("@src/models/ListOfAttendanceRoomMember"));
const AttendanceRoom_1 = __importDefault(require("@src/models/AttendanceRoom"));
describe('Operator functional test', () => {
    let token;
    beforeEach(async () => {
        await typeorm_1.getRepository(Operator_1.default).createQueryBuilder().delete().execute();
        const operatoRepository = typeorm_1.getRepository(User_1.default);
        const user = await operatoRepository.findOne({ where: { login: 'admin' } });
        if (!user)
            return;
        token = await jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN || 'ola');
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
            expect(body).toEqual(expect.objectContaining({
                name: 'John Green',
                email: 'john.green@email.com',
            }));
        });
        it('should not create a operator when field is invalid', async () => {
            const { status, body } = await global.testRequest
                .post('/operator')
                .set({ 'x-access-token': token })
                .send({
                name: 'John Green',
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
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
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
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
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
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
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
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
            const newOperator = await operatorRepository.create(operator);
            await operatorRepository.save(newOperator);
            const { status, body } = await global.testRequest
                .post('/operator/signin')
                .send({
                email: 'john.green@email.com',
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
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
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
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
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
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
            const newOperator = await operatorRepository.create(operator);
            await operatorRepository.save(newOperator);
            const { status, body } = await global.testRequest
                .post('/operator/forgotPassword')
                .send({});
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
            const request = uuid_1.v4();
            const operatorRepository = typeorm_1.getRepository(Operator_1.default);
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
            const repositoryOperato = await typeorm_1.getRepository(Operator_1.default);
            const _operator = repositoryOperato.create(operator);
            await repositoryOperato.save(_operator);
            const telToken = await jsonwebtoken_1.default.sign({ id: _operator.id }, process.env.TOKEN || 'ola');
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
            await typeorm_1.getRepository(AttendanceRoom_1.default)
                .createQueryBuilder()
                .delete()
                .execute();
            await typeorm_1.getRepository(ListOfAttendanceRoomMember_1.default)
                .createQueryBuilder()
                .delete()
                .execute();
        });
        it('should return rooms by athenticate operator', async () => {
            const name = 'Posto 1';
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(name);
            const newOperator = await OperatorRepository_1.default.store(operator);
            const newMember = {
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
                name: newOperator === null || newOperator === void 0 ? void 0 : newOperator.name,
            };
            await ListOfAttendanceRoomMemberRepository_1.default.store(newMember);
            const operatorToken = await jsonwebtoken_1.default.sign({ id: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id }, process.env.TOKEN || 'olá');
            const { status, body } = await global.testRequest
                .get('/operator/room')
                .set({ 'x-access-token': operatorToken })
                .send();
            expect(status).toBe(200);
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
            const newOperator = await OperatorRepository_1.default.store(operator);
            const operatorToken = await jsonwebtoken_1.default.sign({ id: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id }, process.env.TOKEN || 'olá');
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
//# sourceMappingURL=operator.test.js.map