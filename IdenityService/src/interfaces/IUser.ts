import { Address } from '../models/address.model';

export interface IUser {
  id?: string;
  identifier: string;
  name: string;
  birthDate: Date;
  authId: string;
  address: Address;
}
