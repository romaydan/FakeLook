import { User } from '../models/user.model';
import { Sequelize } from 'sequelize-typescript';
import RefreshToken from '../models/refreshtoken.model';

const db = new Sequelize('auth', 'postgres', process.env.POSTGRES_PASSWORD, {
    dialect: 'postgres',
    host: process.env.POSTGRES_IP,
    port: Number(process.env.POSTGRES_PORT),
    logging: (sql, timing) => {},
});

db.addModels([User, RefreshToken]);

export default db; 