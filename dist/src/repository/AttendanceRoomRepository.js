"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AttendanceRoom_1 = __importDefault(require("@src/models/AttendanceRoom"));
const typeorm_1 = require("typeorm");
class AttendanceRoomRepository {
    async store(name) {
        try {
            const repository = typeorm_1.getRepository(AttendanceRoom_1.default);
            const attendanceRoom = repository.create({ name });
            await repository.save(attendanceRoom);
            return attendanceRoom;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getByName(name) {
        try {
            const repository = typeorm_1.getRepository(AttendanceRoom_1.default);
            const result = await repository.findOne({ where: { name } });
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getByNameMany(name = '') {
        try {
            const repository = typeorm_1.getRepository(AttendanceRoom_1.default);
            const result = await repository
                .createQueryBuilder()
                .where('name LIKE :name', { name: `%${name}%` })
                .getMany();
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getById(id) {
        try {
            const repository = typeorm_1.getRepository(AttendanceRoom_1.default);
            const result = await repository.findOne({
                where: { id },
            });
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async getByIdWithMember(id) {
        try {
            const repository = typeorm_1.getRepository(AttendanceRoom_1.default);
            const result = repository
                .createQueryBuilder('attendanceRoom')
                .leftJoinAndSelect('attendanceRoom.members', 'listOfAttendanceRoomMembers')
                .where('attendanceRoom.id = :id ', { id })
                .getOne();
            return result;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
}
exports.default = new AttendanceRoomRepository();
//# sourceMappingURL=AttendanceRoomRepository.js.map