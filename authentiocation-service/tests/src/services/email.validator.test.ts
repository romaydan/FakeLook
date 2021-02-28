import { EmailValidator } from "../../../src/services/emailvalidator";

describe('testing validate', () => {
    test('passing valid email, expecting true', () => {
        const service = new EmailValidator();
        const email = 'test@email.com';

        expect(service.validate(email))
            .toEqual(true);
    })

    test('passing invalid email, expecting an error', () => {

    })

    test('passing undefined, expecting an error', () => {
        try {
            const service = new EmailValidator();
            service.validate(undefined);
        } catch (error) {
            expect(error)
                .toBeTruthy();
        }
    })
})