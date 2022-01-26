const path = require('path');
const dotenv = require('dotenv');

(async function () {
  await dotenv.config();
})();

module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  entities: [
    process.env.NODE_ENV === 'dev'
      ? `${path.resolve(__dirname, 'src/models/*.ts')}`
      : `${path.resolve(__dirname, 'dist/src/models/*.js')}`,
  ],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: ['src/database/subscriber/**/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
