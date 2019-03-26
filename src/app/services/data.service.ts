import { Injectable } from '@angular/core';
import {User} from "../models";
import {Device} from "../models/device";

@Injectable()
export class DataService {

  userDs: User = new User();
  deviceDs: Device = new Device();

  private _paramDs: string = "";

  constructor() { }

  setUserDs(usr: User){
    this.userDs = usr;
  }

  getUserDs():User{
    return this.userDs;
  }

  setDeviceDs(dev: Device){
    this.deviceDs = dev;
  }

  getDeviceDs():Device{
    return this.deviceDs;
  }


  getParamDs(): string {
    return this._paramDs;
  }

  setParamDs(value: string) {
    this._paramDs = value;
  }
}
