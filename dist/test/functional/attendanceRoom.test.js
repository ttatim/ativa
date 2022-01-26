"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AttendanceRoom_1 = __importDefault(require("@src/models/AttendanceRoom"));
const User_1 = __importDefault(require("@src/models/User"));
const Operator_1 = __importDefault(require("@src/models/Operator"));
const AttendanceRoomRepository_1 = __importDefault(require("@src/repository/AttendanceRoomRepository"));
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const OperatorRepository_1 = __importDefault(require("@src/repository/OperatorRepository"));
const ListOfAttendanceRoomMemberRepository_1 = __importDefault(require("@src/repository/ListOfAttendanceRoomMemberRepository"));
const ListOfAttendanceRoomMember_1 = __importDefault(require("@src/models/ListOfAttendanceRoomMember"));
describe('Attendance Room functional test', () => {
    let token = '';
    const operator = {
        name: 'John Green',
        email: 'john.green@email.com',
        password: '123456',
    };
    const telepresenca = {
        name: 'Tela',
        login: 'Tela.1',
        password: '123456',
    };
    beforeEach(async () => {
        await typeorm_1.getRepository(AttendanceRoom_1.default).createQueryBuilder().delete().execute();
        const operatoRepository = typeorm_1.getRepository(User_1.default);
        const user = await operatoRepository.findOne({ where: { login: 'admin' } });
        if (!user)
            return;
        token = await jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN || 'ola');
    });
    describe('When create Attendance Room', () => {
        it('should not create attendance room when admin does not authenticated', async () => {
            const { status, body } = await global.testRequest
                .post('/attendanceRoom')
                .send({ name: 'Posto 1' });
            expect(status).toBe(401);
            expect(body).toEqual({
                code: 401,
                error: 'Unauthorized',
                msg: 'Restricted access',
            });
        });
        it('should create Attendance room', async () => {
            const { status, body } = await global.testRequest
                .post('/attendanceRoom')
                .set({ 'x-access-token': token })
                .send({
                name: 'Posto 1',
            });
            expect(status).toBe(201);
            expect(body).toEqual(expect.objectContaining({ name: 'Posto 1' }));
        });
        it('should not create Attendance Room when already exists', async () => {
            const name = 'Posto 1';
            await AttendanceRoomRepository_1.default.store(name);
            const { status, body } = await global.testRequest
                .post('/attendanceRoom')
                .set({ 'x-access-token': token })
                .send({ name });
            expect(status).toBe(409);
            expect(body).toEqual({
                msg: 'Email already exists',
                code: 409,
                error: 'Conflit',
            });
        });
        it('should not create when name is undefined', async () => {
            const { status, body } = await global.testRequest
                .post('/attendanceRoom')
                .set({ 'x-access-token': token })
                .send();
            expect(status).toBe(400);
            expect(body).toEqual({
                errors: [
                    {
                        location: 'body',
                        msg: 'Name cannot be empty',
                        param: 'name',
                    },
                ],
            });
        });
    });
    describe('Find Atteandance Room', () => {
        beforeEach(async () => {
            await typeorm_1.getRepository(Operator_1.default).createQueryBuilder().delete().execute();
            await typeorm_1.getRepository(ListOfAttendanceRoomMember_1.default)
                .createQueryBuilder()
                .delete()
                .execute();
        });
        it('should not return attendance rooms when admin does not authenticated', async () => {
            const { status, body } = await global.testRequest
                .get(`/attendanceRoom?name=Po`)
                .send();
            expect(status).toBe(401);
        });
        it('should return attendance room', async () => {
            const name = 'Posto 1';
            await AttendanceRoomRepository_1.default.store(name);
            const { status, body } = await global.testRequest
                .get(`/attendanceRoom?name=Po`)
                .set({ 'x-access-token': token })
                .send();
            expect(status).toBe(200);
            expect(body).toEqual([expect.objectContaining({ name })]);
        });
        it('should return attendance room by id with member when operator was athenticate', async () => {
            const name = 'Posto 1';
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(name);
            const newOperator = await OperatorRepository_1.default.store(operator);
            const newMember = {
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            };
            await ListOfAttendanceRoomMemberRepository_1.default.store(newMember);
            const operatorToken = await jsonwebtoken_1.default.sign({ id: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id }, process.env.TOKEN || 'ola');
            const { status, body } = await global.testRequest
                .get(`/attendanceRoom/${newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id}`)
                .set({ 'x-access-token': operatorToken })
                .send();
            expect(status).toBe(200);
            expect(body).toEqual(expect.objectContaining({
                id: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
            }));
        });
    });
});
//# sourceMappingURL=attendanceRoom.test.js.map