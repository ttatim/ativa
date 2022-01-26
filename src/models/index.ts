import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Generated,
  UpdateDateColumn,
} from 'typeorm';

export interface BaseColumnsSchemaName {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export abstract class BaseColumnSchemaPart {
  @PrimaryColumn()
  @Generated('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;
}
