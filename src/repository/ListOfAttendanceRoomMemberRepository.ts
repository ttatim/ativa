import ListOfAttendanceRoomMember from '@src/models/ListOfAttendanceRoomMember';
import { getRepository } from 'typeorm';

class ListOfAttendanceRoomMemberRepository {
  public async findOne({
    id_attendanceRoom,
    id_member_operator,
    id_member_telepresenca,
    type,
  }: ListOfAttendanceRoomMember): Promise<
    ListOfAttendanceRoomMember | undefined
  > {
    try {
      const findBy = JSON.parse(
        JSON.stringify({
          id_attendanceRoom,
          id_member_operator,
          id_member_telepresenca,
          type,
        })
      );
      const repository = getRepository(ListOfAttendanceRoomMember);
      const result = await repository.findOne({
        where: findBy,
      });
      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async store(
    data: ListOfAttendanceRoomMember
  ): Promise<ListOfAttendanceRoomMember | undefined> {
    try {
      const {
        id_attendanceRoom,
        id_member_operator,
        id_member_telepresenca,
        type,
        name,
      } = data;
      const repository = getRepository(ListOfAttendanceRoomMember);
      const member = repository.create({
        id_attendanceRoom,
        id_member_operator,
        id_member_telepresenca,
        type,
        name,
      });
      await repository.save(member);

      return member;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async remove(id: string): Promise<boolean | undefined> {
    try {
      const repository = getRepository(ListOfAttendanceRoomMember);
      const {
        affected,
      } = await repository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute();

      return !!affected;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}

export default new ListOfAttendanceRoomMemberRepository();
