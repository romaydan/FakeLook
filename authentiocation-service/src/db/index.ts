import { FakLookUser } from '../models/fakelook-user.model';
import { FacebookUser } from '../models/facebook-user.model';
import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize({
    dialect: 'sqlite',
    storage: `${__dirname}\\data\\authDb.db`
});

db.addModels([FakLookUser, FacebookUser]);

export default db; 