import { UserRepository } from '../../../src/repositories/user-repository';
import { User, IUser } from '../../../src/models/user.model';
import { Sequelize } from 'sequelize-typescript';

const path = __dirname + '\\db\\authDb.test.db';
const db = new Sequelize({
    dialect: 'sqlite',
    storage: path
});
db.addModels([User]);

beforeEach(async () => {
    await db.sync({ force: true });
})

describe('testing addUser', () => {
    test('passing valid data, expecting id to be truthy', async (done) => {
        const repository = new UserRepository();

        const user = await repository.addUser({ identifier: 'test@test.com', password: 'password', isOAuthUser: false });
        expect(user.id).toBeTruthy();
        done();
    });

    test('passing invalid data, expecting error', () => {
        const repository = new UserRepository();
        expect(repository.addUser({ identifier: null, password: null, isOAuthUser: false })).rejects.toThrow();
    });

    test('passing undefiend, expecting error', () => {
        const repository = new UserRepository();
        const user = undefined;
        expect(repository.addUser(user)).rejects.toThrow();
    });
});

describe('testing getByUserIdentifier', () => {
    beforeEach(async () => {
        const users: IUser[] = [
            {
                identifier: 'test@test.com',
                password: '123456',
                isOAuthUser: true
            },
            {
                identifier: 'email@test.com',
                password: '123456',
                isOAuthUser: false
            },
            {
                identifier: 'test1234@email.com',
                password: '123456',
                isOAuthUser: false
            }
        ]
        await User.bulkBuild(users).forEach(async user => await user.save());
    })

    test('passing valid identifier, expecting a user', async (done) => {
        const repository = new UserRepository();

        const user = await repository.getByUserIdentifier('test@test.com');
        expect(user).not.toBeUndefined();
        done();
    });

    test('passing invalid indentifier, expecting no user', async (done) => {
        const repository = new UserRepository();
        const user = await repository.getByUserIdentifier('test@gmail.com');
        expect(user).toBeNull();
        done();
    });

    test('passing undefiend, expecting no user', async (done) => {
        const repository = new UserRepository();
        const user = await repository.getByUserIdentifier(undefined);
        expect(user).toBeNull();
        done();
    });
});