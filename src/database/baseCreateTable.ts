import { TableColumn } from 'typeorm';

export const BaseCreateColumns = [
  {
    name: 'id',
    type: 'varchar',
    isPrimary: true,
    generationStrategy: 'uuid',
  } as TableColumn,
  {
    name: 'created_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  } as TableColumn,
  {
    name: 'updated_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  } as TableColumn,
];
