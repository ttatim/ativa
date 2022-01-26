import { Column, Entity, OneToMany } from 'typeorm';
import { BaseColumnSchemaPart } from '.';
import ListOfAttendanceRoomMember from './ListOfAttendanceRoomMember';

@Entity('attendanceRoom')
class AttendanceRoom extends BaseColumnSchemaPart {
  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => ListOfAttendanceRoomMember,
    (listOfAttendanceRoomMembers) =>
      listOfAttendanceRoomMembers.id_attendanceRoom
  )
  members!: ListOfAttendanceRoomMember[];
}

export default AttendanceRoom;
