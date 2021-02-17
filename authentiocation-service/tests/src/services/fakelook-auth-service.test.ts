import { IUser } from '../../../src/models/user.model';
import { FakeLookAuthenticationService } from '../../../src/services/fakelook-authentication-service';
import { UserRepository } from '../../../src/repositories/user-repository';


let users : IUser[];

jest.mock('password-hash', () => {
    return jest.fn().mockImplementation(() => ({
        verify: (password: string, hashedPassword: string) => password == hashedPassword,
        generate: (password: string) => password
    }))
})

jest.mock('../../../src/repositories/user-repository')

describe('testing signIn', () => {

    beforeAll(() => {
        UserRepository.mockImplementation(() => ({
            getByEmail: (email: string): Promise<IUser> => {
                return Promise.resolve(users.find(u => u.email === email));
            },
            addUser: (user: IUser) : Promise<IUser> => {
                return Promise.resolve({ id: '3', email: user.email, password: user.password, isEditable: true })
            }
        }))
    })

    beforeEach(() => {
        users = [
            {
                id: '1',
                email: 'test@test.com',
                password: '123456',
                isEditable: true
            },
            {
                id: '2',
                email: 'email@test.com',
                password: '123456',
                isEditable: true
            }
        ];
    })

    test('passing valid email and password', async (done) => {
        const service = new FakeLookAuthenticationService(new UserRepository(null));
        const token = await service.signIn('test@test.com', '123456');
        expect(token).toBeTruthy()
        done();
    })
})