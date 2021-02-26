import { formatNamedParameters } from "sequelize/types/lib/utils";
import { IRefreshToken } from "../../../src/models/refreshtoken.model";
import { RefreshTokenRepository } from "../../../src/repositories/refreshtoken.repository";
import { TokenBlackListService } from "../../../src/services/token.blacklist.service";

let blackList: IRefreshToken[];

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;

jest.mock('../../../src/repositories/refreshtoken.repository');

const mockRefreshTokenRepository = <jest.Mock<RefreshTokenRepository>>RefreshTokenRepository;
mockRefreshTokenRepository.mockImplementation(() => ({
    blackListToken: async (token: string): Promise<boolean> => {
        if (!JWT_REGEX.test(token)) {
            throw new Error();
        }

        blackList.push({ id: 1, token });
        return Promise.resolve(true);
    },
    isBlackListed: (token: string): Promise<boolean> => {
        const refreshToken = blackList.find(t => t.token === token);
        return Promise.resolve(refreshToken ? true : false);
    }
}));

describe('testing blackListToken', () => {
    beforeEach(() => {
        blackList = [];
    })

    test('passing a token, expecting token to be added to blacklist', async done => {
        const repository = mockRefreshTokenRepository.getMockImplementation()();
        const service = new TokenBlackListService(repository);
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        await service.blackListToken(token);

        expect(blackList.find(t => t.token === token))
            .toBeTruthy();

        done();
    });

    test('passing undefiend, expecting a error', async (done) => {
        try {
            const repository = mockRefreshTokenRepository.getMockImplementation()();
            const service = new TokenBlackListService(repository);

            await service.blackListToken(undefined);
        } catch (error) {
            expect(error)
                .toBeTruthy();
        }

        done();
    });

    test('passing invalid jwt, expecting a error', () => {
        const repository = mockRefreshTokenRepository.getMockImplementation()();
        const service = new TokenBlackListService(repository);
        const token = "invalid";
        expect(service.blackListToken(token))
            .rejects
            .toThrow();
    });
});

describe('testing isBlackedListed', () => {
    beforeEach(() => {
        blackList = [
            {
                id: 1,
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            },
            {
                id: 2,
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3R5IE1hY1Rlc3RmYWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.jvx9WCr_KbKfpqZm5QNSylKD-hJzcDuz8Y-2_peDyPk"
            }
        ];
    });

    test('passing a known token. expecting true', () => {
        const repository = mockRefreshTokenRepository.getMockImplementation()();
        const service = new TokenBlackListService(repository);
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3R5IE1hY1Rlc3RmYWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.jvx9WCr_KbKfpqZm5QNSylKD-hJzcDuz8Y-2_peDyPk';

        expect(service.isBlackedListed(token))
            .resolves
            .toBe(true);
    })

    test('passing a token. expecting false', () => {
        const repository = mockRefreshTokenRepository.getMockImplementation()();
        const service = new TokenBlackListService(repository);
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5vdCBCbGFja0xpc3RlZCBUb2tlbiIsImlhdCI6MTUxNjIzOTAyMn0.vKmqWvN8YX5DRSEaBNoMxh0T69uUm0Xt-_CILbHn3aI';

        expect(service.isBlackedListed(token))
            .resolves
            .toBe(false);
    })

    test('passing undefiend. expecting an error', async (done) => {
        try {
            const repository = mockRefreshTokenRepository.getMockImplementation()();
            const service = new TokenBlackListService(repository);
            const token = undefined;

            await service.isBlackedListed(token);
        } catch (error) {
            expect(error)
                .toBeTruthy();
        }

        done();
    })
})