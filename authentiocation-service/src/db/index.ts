import { User } from '../models/user.model';
import { Sequelize } from 'sequelize-typescript';
import RefreshToken from '../models/refreshtoken.model';

const db = new Sequelize({
    dialect: 'sqlite',
    storage: `${__dirname}\\data\\authDb.db`
});

db.addModels([User, RefreshToken]);

export default db; 