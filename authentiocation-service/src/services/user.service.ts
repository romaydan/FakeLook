import { inject, injectable } from "inversify";
import { TYPES } from "../ioc-container/types";
import { IUser } from "../models/user.model";
import { IUserRepository } from "../repositories/user.repository";


export interface IUserService {
    getUserById(userId: string): Promise<IUser>;
    getUserByIdentifier(identifier: string): Promise<IUser>;
}

@injectable()
export class UserService implements IUserService {
    constructor(@inject(TYPES.IUserRepository) private repository: IUserRepository) {

    }

    getUserById(userId: string): Promise<IUser> {
        return this.repository.getUserById(userId);
    }

    getUserByIdentifier(identifier: string): Promise<IUser> {
        return this.repository.getByUserIdentifier(identifier);
    }
}