"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("@src/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ListOfAttendanceRoomMember_1 = __importDefault(require("@src/models/ListOfAttendanceRoomMember"));
const OperatorRepository_1 = __importDefault(require("@src/repository/OperatorRepository"));
const Operator_1 = __importDefault(require("@src/models/Operator"));
const AttendanceRoomRepository_1 = __importDefault(require("@src/repository/AttendanceRoomRepository"));
const AttendanceRoom_1 = __importDefault(require("@src/models/AttendanceRoom"));
const Telepresenca_1 = __importDefault(require("@src/models/Telepresenca"));
const ListOfAttendanceRoomMemberRepository_1 = __importDefault(require("@src/repository/ListOfAttendanceRoomMemberRepository"));
describe('List of Attendance Room Members functional test', () => {
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
    const attendaceRoom = { name: 'Posto' };
    beforeEach(async () => {
        await typeorm_1.getRepository(ListOfAttendanceRoomMember_1.default)
            .createQueryBuilder()
            .delete()
            .execute();
        await typeorm_1.getRepository(AttendanceRoom_1.default).createQueryBuilder().delete().execute();
        await typeorm_1.getRepository(Operator_1.default).createQueryBuilder().delete().execute();
        await typeorm_1.getRepository(Telepresenca_1.default).createQueryBuilder().delete().execute();
        const userRepository = typeorm_1.getRepository(User_1.default);
        const user = await userRepository.findOne({ where: { login: 'admin' } });
        if (!user)
            return;
        token = await jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN || 'ola');
    });
    describe('When create member', () => {
        it('should not create member, when user does not authenticate', async () => {
            const newOperator = await OperatorRepository_1.default.store(operator);
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(attendaceRoom.name);
            const { status, body } = await global.testRequest
                .post('/listOfAttendanceRoomMember')
                .send({
                id_attandanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            });
            expect(status).toBe(401);
            expect(body).toEqual({
                code: 401,
                error: 'Unauthorized',
                msg: 'Restricted access',
            });
        });
        it('should create members', async () => {
            const newOperator = await OperatorRepository_1.default.store(operator);
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(attendaceRoom.name);
            const { status, body } = await global.testRequest
                .post('/listOfAttendanceRoomMember')
                .set({ 'x-access-token': token })
                .send({
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            });
            expect(status).toBe(201);
            expect(body).toEqual(expect.objectContaining({
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            }));
        });
        it('should not create, when Attendance Room does not exists', async () => {
            const newOperator = await OperatorRepository_1.default.store(operator);
            const { status, body } = await global.testRequest
                .post('/listOfAttendanceRoomMember')
                .set({ 'x-access-token': token })
                .send({
                id_attendanceRoom: 'invalid',
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            });
            expect(status).toBe(404);
            expect(body).toEqual({
                error: 'Not Found',
                msg: 'Attendance Room not found',
                code: 404,
            });
        });
        it('should not create, when operator does not exists', async () => {
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(attendaceRoom.name);
            const { status, body } = await global.testRequest
                .post('/listOfAttendanceRoomMember')
                .set({ 'x-access-token': token })
                .send({
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: 'invalid',
                type: 'operator',
            });
            expect(status).toBe(404);
            expect(body).toEqual({
                error: 'Not Found',
                msg: 'Member not found',
                code: 404,
            });
        });
        it('should not create, when fileds are invalid', async () => {
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(attendaceRoom.name);
            const { status, body } = await global.testRequest
                .post('/listOfAttendanceRoomMember')
                .set({ 'x-access-token': token })
                .send({
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                type: 'operator',
            });
            expect(status).toBe(400);
        });
    });
    describe('When remove member', () => {
        it('should not remove when user is not authenticate', async () => {
            const newOperator = await OperatorRepository_1.default.store(operator);
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(attendaceRoom.name);
            const newMember = {
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            };
            const itemListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository_1.default.store(newMember);
            const { status, body } = await global.testRequest
                .delete(`/listOfAttendanceRoomMember/${itemListOfAttendanceRoomMember === null || itemListOfAttendanceRoomMember === void 0 ? void 0 : itemListOfAttendanceRoomMember.id}`)
                .send();
            expect(status).toBe(401);
            expect(body).toEqual({
                code: 401,
                error: 'Unauthorized',
                msg: 'Restricted access',
            });
        });
        it('should remove member', async () => {
            const newOperator = await OperatorRepository_1.default.store(operator);
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(attendaceRoom.name);
            const newMember = {
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            };
            const itemListOfAttendanceRoomMember = await ListOfAttendanceRoomMemberRepository_1.default.store(newMember);
            const { status, body } = await global.testRequest
                .delete(`/listOfAttendanceRoomMember/${itemListOfAttendanceRoomMember === null || itemListOfAttendanceRoomMember === void 0 ? void 0 : itemListOfAttendanceRoomMember.id}`)
                .set({ 'x-access-token': token })
                .send();
            expect(status).toBe(200);
            expect(body).toEqual({
                msg: 'Request successful',
            });
        });
        it('should return error 404 when member not found', async () => {
            const newOperator = await OperatorRepository_1.default.store(operator);
            const newAttendanceRoom = await AttendanceRoomRepository_1.default.store(attendaceRoom.name);
            const newMember = {
                id_attendanceRoom: newAttendanceRoom === null || newAttendanceRoom === void 0 ? void 0 : newAttendanceRoom.id,
                id_member_operator: newOperator === null || newOperator === void 0 ? void 0 : newOperator.id,
                type: 'operator',
            };
            await ListOfAttendanceRoomMemberRepository_1.default.store(newMember);
            const { status, body } = await global.testRequest
                .delete(`/listOfAttendanceRoomMember/345de-fferr-ddd'}`)
                .set({ 'x-access-token': token })
                .send();
            expect(status).toBe(404);
            expect(body).toEqual({
                error: 'Not Found',
                code: 404,
                msg: 'Member not found',
            });
        });
    });
});
//# sourceMappingURL=listOfAttendanceRoomMembers.test.js.map