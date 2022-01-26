import { createConnection, Connection, getConnectionOptions } from 'typeorm';

let db!: Connection;
export const connect = async (): Promise<void> => {
  const connectioOption = await getConnectionOptions();
  db = await createConnection(connectioOption);
};

export const close = async (): Promise<void> => await db.close();
