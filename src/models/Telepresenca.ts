import { Column, Entity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseColumnSchemaPart } from '.';
import bcryptjs from 'bcryptjs';

@Entity('telepresenca')
class Operator extends BaseColumnSchemaPart {
  @Column()
  name!: string;

  @Column({ unique: true })
  login!: string;

  @Column()
  password!: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcryptjs.hashSync(this.password, 8);
  }
}
export default Operator;
