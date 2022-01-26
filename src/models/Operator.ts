import { Column, Entity, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { BaseColumnSchemaPart } from '.';
import bcryptjs from 'bcryptjs';

@Entity('operator')
class Operator extends BaseColumnSchemaPart {
  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  request?: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcryptjs.hashSync(this.password, 8);
  }

  @BeforeUpdate()
  async hasPasswordNew() {
    await this.hashPassword();
  }
}
export default Operator;
