import { JwtService } from "../../../src/services/jwt.service";

jest.mock('jsonwebtoken', () => {
    return ({
        sign: (payload, secret, options) => {
            if (!payload)
                throw 'error';

            return 'encoded-token';
        },
        verify: (token, secret, options) => {
            if (token === 'encoded-token') {
                return { userId: '1', iat: 123345678, exp: 123456789 };
            }

            throw 'error';
        }
    })
});

describe('testing signToken', () => {
    test('passing valid payload, expect a sign token', () => {
        const service = new JwtService();

        expect(service.signToken({ id: 'test' }, '15m'))
            .toEqual('encoded-token');
    })

    test('passing no payload, expecting an error', (done) => {
        try {
            const service = new JwtService();
            service.signToken(undefined, '15m')
        } catch (error) {
            expect(error)
                .toBeTruthy();
        }

        done();
    })
})

describe('testing verifyToken', () => {
    test('passing valid token, expect true', () => {
        const service = new JwtService();

        expect(service.verifyToken('encoded-token').userId)
            .toEqual('1');
    })

    test('passing invalid token, expecting an error', done => {
        try {
            const service = new JwtService();
            service.verifyToken('invalid');
        } catch (error) {
            expect(error)
                .toBeTruthy();
        }
        done();
    })
})