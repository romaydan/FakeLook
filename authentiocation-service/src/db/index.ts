import { User } from '../models/user.model';
import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize({
    dialect: 'sqlite',
    storage: `${__dirname}\\data\\authDb.db`
});

db.addModels([User]);

export default db; 