import { IUser } from '../../../src/models/user.model';
import { FakeLookAuthenticationService } from '../../../src/services/fakelook.authentication.service';
import { UserRepository } from '../../../src/repositories/user.repository';
import { PasswordValidator } from '../../../src/services/password.validator';


let users : IUser[];

jest.mock('password-hash', () => {
    return ({
        verify: (password: string, hashedPassword: string): boolean => {
            const success = password == hashedPassword;
            return success;
        },
        generate: (password: string): string => password
    })
});

jest.mock('../../../src/repositories/user.repository');

const mockRepository = <jest.Mock<UserRepository>>UserRepository;
mockRepository.mockImplementation(() => ({
    addUser(user: IUser): Promise<IUser> {
        if(!user.identifier || !user.password) {
            throw new Error();
        }

        if(users.find(u => u.identifier === user.identifier)) {
            throw new Error('Email in use');
        }

        return Promise.resolve({ id: '3', identifier: user.identifier, password: user.password, isOAuthUser: false })
    },
    getByUserIdentifier(identifier: string): Promise<IUser> {
        return Promise.resolve(users.find(u => u.identifier === identifier));
    },
    UpdateUser: (user: IUser) => {
        const index = users.findIndex(u => u.id === user.id);
        if(index >= 0) {
            users[0] = user;
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}) as UserRepository);


describe('testing signIn', () => {
    beforeEach(() => {
        users = [
            {
                id: '1',
                identifier: 'test@test.com',
                password: '12345678',
                isOAuthUser: false
            },
            {
                id: '2',
                identifier: 'email@test.com',
                password: '12345678',
                isOAuthUser: false
            }
        ];
    })

    test('passing valid email and password', async (done) => {
        const repository = mockRepository.getMockImplementation()();

        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());
        const userId = await service.signIn('test@test.com', '12345678');
        expect(userId).toEqual('1')
        done();
    });

    test('passing invalid email and password, expecting error', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());
        expect(service.signIn('invalid', ''))
        .rejects
        .toThrow()
    });

    test('passing valid email and invalid password, expecting error', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());
        expect(service.signIn('invalid', ''))
        .rejects
        .toThrow()
    });
});

describe('testing signUp', () => {
    beforeEach(() => {
        users = [
            {
                id: '1',
                identifier: 'test@test.com',
                password: '12345678',
                isOAuthUser: false
            },
            {
                id: '2',
                identifier: 'email@test.com',
                password: '12345678',
                isOAuthUser: false
            }
        ];
    })

    test('passing valid email and password, expecting a new user', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());
        const email = 'email@valid.com', password = '12345', confirmPassword = '12345';

        expect(service.signUp(email, password, confirmPassword))
        .resolves
        .toBeTruthy()
    });

    test('passing taken email, expecting error', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());
        const email = 'test@test.com', password = '12345678', confirmPassword = '12345678';

        expect(service.signUp(email, password, confirmPassword))
        .rejects
        .toThrow();
    })

    test('passing differant password and confirmPassword, expecting error', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());
        const email = 'test@test.com', password = '12345678', confirmPassword = '123';

        expect(service.signUp(email, password, confirmPassword))
        .rejects
        .toThrow();
    });

    test('passing undefined email and password, expecting error', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());

        expect(service.signUp(undefined, undefined, undefined))
        .rejects
        .toThrow();
    });
});

describe('testing resetPassword', () => {
    beforeEach(() => {
        users = [
            {
                id: '1',
                identifier: 'test@test.com',
                password: '12345678',
                isOAuthUser: false
            },
            {
                id: '2',
                identifier: 'email@test.com',
                password: '12345678',
                isOAuthUser: false
            }
        ];
    })

    test('passing valid arguments, expecting user\'s password to change', async (done) => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());
        const user = users[0];
        const newPassowrd = '12345678';

        await service.resetPassword(user.identifier, user.password, newPassowrd, newPassowrd);

        expect(users[0].password)
        .toEqual(newPassowrd);

        done();
    });

    test('passing invalid arguments expecting error', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FakeLookAuthenticationService(repository, new PasswordValidator());

        expect(service.resetPassword('invalid@email.com', '12345678', '123456789', '123456'))
        .rejects
        .toThrow();
    });
})
