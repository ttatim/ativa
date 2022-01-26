import { Column, Entity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseColumnSchemaPart } from '.';
import bcryptjs from 'bcryptjs';

@Entity('users')
class Operator extends BaseColumnSchemaPart {
  @Column()
  name!: string;

  @Column({ unique: true })
  login!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  type!: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcryptjs.hashSync(this.password, 8);
  }
}
export default Operator;
