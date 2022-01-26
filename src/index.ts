import { SetupServer } from './server';
import dotenv from 'dotenv';

(async () => {
  await dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  });
  console.log(process.env.DB_TYPE, process.env.DB_NAME);
  try {
    const server = new SetupServer();
    await server.init();
    server.start();
  } catch (err) {
    console.log(err);
  }
})();
