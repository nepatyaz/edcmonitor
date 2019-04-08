import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {Subscriber} from "rxjs/Subscriber";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {User} from "../models/user";
import {Device} from "../models/device";
import {SearchData} from "../models/searchdata";
import {HttpParams} from "@angular/common/http";
import {DataService} from "./data.service";

@Injectable()
export class DeviceService {
  
  apiUrl = "http://127.0.0.1:3000";
  apiUrl2 = "api/";
  
  params: string = '';

  headers = new Headers({"Authorization": "Bearer " + JSON.parse(localStorage.getItem('token')),
    'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});

 
  constructor(private http: Http,
              private dataService: DataService) { }

  getAllDevices():any{

    return this.http.get(this.apiUrl2+'device', this.options)
      .map(res => {
        console.log('getAllDevices' ,res.json());
        return res.json();
      });
  }

  getDeviceByBranch(search : SearchData):any{

    return this.http.post(this.apiUrl2+'/device/search', 
                          search ,this.options)
      .map(res => {
        console.log('getDeviceByBranch()' ,res.json());
        return res.json();
      });
  }

  getDeviceUserByDvbrch():any{

    return this.http.get(this.apiUrl2+'device/dvbrch', this.options)
      .map(res => {
        console.log('getDeviceUserByDvbrch()' ,res.json());
        return res.json();
      });
  }

  getCurrentUser():User{
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  getByBranch():any{
    //let search : SearchData = new SearchData();
    //search = this.getParam();
    let s: string = this.getParam();
    //console.log('search ', search);

    return this.http.post(this.apiUrl2+'device/search',
      {
        "searchKey": s
      } ,this.options)
      .map(res => {
        console.log('getDeviceByBranch() =>' ,res.json());
        return res.json();
      });
  }


  create(device: Device) {
    // return this.http.post(this.apiUrl+'/api/device', device, this.options)
    return this.http.post(this.apiUrl2+'device/', device, this.options)
    .map(res => res.json())
  }

  update(device: Device) {
    console.log(device);
    // return this.http.put(this.apiUrl+'/api/device' , device, this.options);
    return this.http.put(this.apiUrl2+'device' , device, this.options);

  }

  delete(id: number) {
    // return this.http.delete(this.apiUrl+'/api/device/' + id, this.options);
    return this.http.delete(this.apiUrl2+'device/' + id, this.options);
  }

  setParam(data: string){
    this.params = data;
    console.log('setParam ' ,data);
  }

  getParam():string{
    console.log('getParam ' ,this.params);
    if(this.params === undefined || this.params === null || this.params === ''){
      this.params = this.getCurrentUser().branch;
    }
    return this.params;

  }

  getDeviceStatus():any{
        let status = this.dataService.getParamDs();
        console.log('status ', status);
        return this.http.get(this.apiUrl+'/api/device/status/' + status, this.options)
      .map(res => {
        console.log('getDeviceStatus()' ,res.json());

        return res.json();
      });

  }

}//
