import { IUser } from "../../../src/models/user.model";
import { UserRepository } from "../../../src/repositories/user.repository";
import { FacebookAuthenticationService } from "../../../src/services/facebook.authentication.service";

let users: IUser[];

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

        return Promise.resolve({ id: '3', identifier: user.identifier, password: user.password, isOAuthUser: true })
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

jest.mock('axios', () => {
    return ({
        get: (url: string, config?: any) => {
            return Promise.resolve({
                data: {
                    id: '123456789'
                }
            })
        }
    });
});

describe('testing signIn', () => {
    beforeEach(() => {
        users = [
            {
                id: '1',
                identifier: 'test@test.com',
                password: '123456',
                isOAuthUser: false
            },
            {
                id: '2',
                identifier: 'email@test.com',
                password: '123456',
                isOAuthUser: false
            }
        ];
    })

    test('passing token and facebookId, adding user', () => {
        const repository = mockRepository.getMockImplementation()();
        const service = new FacebookAuthenticationService(repository);
        const token = 'token', facebookId = 'facebookId';

        expect(service.signIn(token, facebookId))
        .resolves
        .toEqual('3');
    });

    test('passing token and facebookId, adding user', async (done) => {
        users.push({
           id: '4',
           identifier: '123456789',
           password: 'passowrd',
           isOAuthUser: true 
        });

        const repository = mockRepository.getMockImplementation()();
        const service = new FacebookAuthenticationService(repository);
        const token = 'token', facebookId = 'facebookId';

        const userId = await service.signIn(token, facebookId);
        const user = users.find(u => u.id === userId);

        expect(user)
        .toBe(users[users.length - 1]);

        done();
    });
})