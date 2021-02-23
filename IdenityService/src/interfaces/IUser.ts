import Address from '../models/address.model';
import IAddress from './IAddress';

export default interface IUser {
  id?: string;
  // identifier: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  authId: string;
  address: IAddress;
}
