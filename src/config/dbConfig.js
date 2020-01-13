import env from './envConfig';

module.exports = {
  production: {
    username: env.PRO_USERNAME,
    password: env.PRO_PASSWORD,
    database: env.PRO_DATABASE,
    host: env.PRO_HOST,
    port: env.PRO_PORT || 5432,
    dialect: 'postgres',
  },

  development: {
    username: env.DB_USERNAME_DEV,
    password: env.DB_PASSWORD_DEV,
    database: env.DATABASE_DEV,
    host: env.DATABASE_URL_DEV || '127.0.0.1',
    port: env.DB_PORT_DEV || 5432,
    dialect: 'postgres',
  },

  test: {
    username: env.DB_USERNAME_TEST,
    password: env.DB_PASSWORD_TEST,
    database: env.DATABASE_TEST,
    host: env.DATABASE_URL_TEST || '127.0.0.1',
    port: env.DB_PORT_TEST || 5432,
    dialect: 'postgres',
  }
};
