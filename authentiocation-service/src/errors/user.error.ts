class UserError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export default UserError;