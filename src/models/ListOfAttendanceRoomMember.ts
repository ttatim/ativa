import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseColumnSchemaPart } from '.';
import AttendanceRoom from './AttendanceRoom';
import Operator from './Operator';
import Telepresenca from './Telepresenca';

export enum TypeMember {
  OPERATOR = 'operator',
  TELEPRESENCA = 'telepresenca',
}

@Entity('listOfAttendanceRoomMembers')
class ListOfAttendanceRoomMember extends BaseColumnSchemaPart {
  @Column()
  @ManyToOne(() => AttendanceRoom, (attendanceRoom) => attendanceRoom.id)
  @JoinColumn({ name: 'id_attendanceRoom' })
  id_attendanceRoom!: string;

  @Column()
  id_member_operator!: string;

  @Column()
  id_member_telepresenca!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: TypeMember,
    default: TypeMember.OPERATOR,
  })
  type!: string;
}

export default ListOfAttendanceRoomMember;
