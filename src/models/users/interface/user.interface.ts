import { Document } from 'mongoose';

export interface IUser extends Document {
  _rol: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
