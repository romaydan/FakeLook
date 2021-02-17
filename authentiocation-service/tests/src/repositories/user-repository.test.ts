// import { Sequelize } from 'sequelize-typescript';
// import { UserRepository } from '../../../src/repositories/user-repository';
// import { User } from '../../../src/models/user.model';

// describe('', () => {
//     test('testing', async () => {
//         const db = new Sequelize({
//             validateOnly: true,
//             dialect: 'sqlite',
//             storage: '../../../src/db/data/authDb.db'
//         });
//         db.addModels([User]);
//         await db.sync();

//         const repository = new UserRepository(db);

//         const user = await repository.addUser({ email: 'test@test.com', password: 'password', isEditable: true });
//         expect(user.id).toBeTruthy();
//     })
// })