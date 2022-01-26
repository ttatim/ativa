"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListOfAttendanceRoomMember_1 = __importDefault(require("@src/models/ListOfAttendanceRoomMember"));
const typeorm_1 = require("typeorm");
class ListOfAttendanceRoomMemberRepository {
    async findOne({ id_attendanceRoom, id_member_operator, id_member_telepresenca, type, }) {
        try {
            const findBy = JSON.parse(JSON.stringify({
                id_attendanceRoom,
                id_member_operator,
                id_member_telepresenca,
                type,
            }));
            const repository = typeorm_1.getRepository(ListOfAttendanceRoomMember_1.default);
            const result = await repository.findOne({
                where: findBy,
            });
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async store(data) {
        try {
            const { id_attendanceRoom, id_member_operator, id_member_telepresenca, type, name, } = data;
            const repository = typeorm_1.getRepository(ListOfAttendanceRoomMember_1.default);
            const member = repository.create({
                id_attendanceRoom,
                id_member_operator,
                id_member_telepresenca,
                type,
                name,
            });
            await repository.save(member);
            return member;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async remove(id) {
        try {
            const repository = typeorm_1.getRepository(ListOfAttendanceRoomMember_1.default);
            const { affected, } = await repository
                .createQueryBuilder()
                .delete()
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
exports.default = new ListOfAttendanceRoomMemberRepository();
//# sourceMappingURL=ListOfAttendanceRoomMemberRepository.js.map