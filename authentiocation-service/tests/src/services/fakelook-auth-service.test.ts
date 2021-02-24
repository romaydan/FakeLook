import { IUser } from '../../../src/models/user.model';
import { FakeLookAuthenticationService } from '../../../src/services/fakelook.authentication.service';
import { UserRepository } from '../../../src/repositories/user.repository';
import passwordHasher from 'password-hash';


let users : IUser[];

jest.mock('password-hash', () => {
    return ({
        verify: (password: string, hashedPassword: string) => {
            const success = password == hashedPassword;
            return success;
        },
        generate: (password: string) => password
    })
});

jest.mock('../../../src/repositories/user-repository');

const mockRepository = <jest.Mock<UserRepository>>UserRepository;
mockRepository.mockImplementation(() => ({
    addUser(user: IUser): Promise<IUser> {
        return Promise.resolve({ id: '3', identifier: user.identifier, password: user.password, isOAuthUser: true })
    },
    getByUserIdentifier(identifier: string): Promise<IUser> {
        return Promise.resolve(users.find(u => u.identifier === identifier));
    }
}) as UserRepository);


describe('testing signIn', () => {

    beforeAll(() => {
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

    test('passing valid email and password', async (done) => {
        const repository = mockRepository.getMockImplementation()();

        const service = new FakeLookAuthenticationService(repository);
        const userId = await service.signIn('test@test.com', '123456');
        expect(userId).toEqual('1')
        done();
    })
});
