import { Sequelize } from 'sequelize-typescript';
import User from '../../models/user.model';
import Address from '../../models/address.model';

const db = new Sequelize('identity', 'postgres', process.env.POSTGRES_PASSWORD, {
  dialect: 'postgres',
  host: process.env.POSTGRES_IP,
  port: Number(process.env.POSTGRES_PORT),
  logging: (sql, timing) => {},
});

db.addModels([User, Address]);

export default db;
