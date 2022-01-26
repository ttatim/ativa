import AttendanceRoom from '@src/models/AttendanceRoom';
import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';
import Operator from '@src/models/Operator';
import { getRepository } from 'typeorm';

class AttendanceRoomRepository {
  public async store(name: string): Promise<AttendanceRoom | undefined> {
    try {
      const repository = getRepository(AttendanceRoom);
      const attendanceRoom = repository.create({ name });
      await repository.save(attendanceRoom);
      return attendanceRoom;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getByName(name: string): Promise<AttendanceRoom | undefined> {
    try {
      const repository = getRepository(AttendanceRoom);
      const result = await repository.findOne({ where: { name } });
      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getByNameMany(
    name: string = ''
  ): Promise<AttendanceRoom[] | undefined> {
    try {
      const repository = getRepository(AttendanceRoom);
      const result = await repository
        .createQueryBuilder()
        .where('name LIKE :name', { name: `%${name}%` })
        .getMany();

      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getById(id: string): Promise<AttendanceRoom | undefined> {
    try {
      const repository = getRepository(AttendanceRoom);
      const result = await repository.findOne({
        where: { id },
      });

      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getByIdWithMember(
    id: string
  ): Promise<AttendanceRoom | undefined> {
    try {
      const repository = getRepository(AttendanceRoom);
      const result = repository
        .createQueryBuilder('attendanceRoom')
        .leftJoinAndSelect(
          'attendanceRoom.members',
          'listOfAttendanceRoomMembers'
        )
        .where('attendanceRoom.id = :id ', { id })
        .getOne();

      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}

export default new AttendanceRoomRepository();
