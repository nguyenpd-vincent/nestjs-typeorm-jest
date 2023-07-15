import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { join } from 'path';
import DatabaseLogger from './databaseLogger';
export default registerAs('database', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    port: parseInt(`${process.env.DATABASE_PORT || 5431}`),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'tabist',
    synchronize: true,
    logging: ['error'],
    logger: new DatabaseLogger(),
    host: process.env.DATABASE_HOST || 'localhost',
    autoLoadEntities: true,
    entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  };
});
