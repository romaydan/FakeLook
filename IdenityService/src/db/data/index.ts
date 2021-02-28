import { Sequelize } from 'sequelize-typescript';
import User from '../../models/user.model';
import Address from '../../models/address.model';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: `${__dirname}\\data\\idenityDb.db`,
});

db.addModels([User, Address]);

export default db;
