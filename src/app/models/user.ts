import { Authority } from './authority';
import { Timestamp } from "rxjs/Rx";

export class User {

  id: number;
  name: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  enabled: boolean;
  isLogin: boolean;
  branch?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  lastPasswordResetDate?: Date = new Date();
  roles?: string[];


}
