import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { User } from "../models/user";
import * as socketIo from 'socket.io-client';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserService {
  apiUrl = "http://127.0.0.1:3000";
  apiUrl2 = "api/";

  constructor(private http: Http) {}

  headers = new Headers({
    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('token')),
    'Content-Type': 'application/json'
  });
  options = new RequestOptions({ headers: this.headers });

  getAll() {
    return this.http.get(this.apiUrl2 + '/api/user/all', this.options)
      .map(res => {
        // console.log('users', res.json());
        return res.json();
      })
  }

  getById(id: number) {
    return this.http.get('/api/users/' + id);
  }

  create(user: User) {
    console.log(user)
    return this.http.post(this.apiUrl2 + 'users/register', user, this.options);
  }

  update(user: User) {
    console.log(user);
    return this.http.put(this.apiUrl2 + '/users/', user, this.options);
  }

  delete(id: number) {
    var url = this.apiUrl2 + "users/delete/" + id;
    return this.http.delete(url, this.options)
      .map(res => res.json());
  }

  getAllUser(): any {
    return this.http.get(this.apiUrl2 + 'users/', this.options)
      .map(res => {
        // console.log('users', res.json());
        return res.json();
      });
  }

  //hitung jumlah user yang terdaftar
  getTotalUser() {
    let url = this.apiUrl2 + "users/count/";
    return this.http.get(url, this.options)
      .map(res => {
        return res.json();
      });
  }

  //dapatkan data user sesuai pagination
  getPageData(value: string) {
    var url = this.apiUrl2 + "users/data" + value;
    // console.log("data url : ", url, this.options);
    return this.http.get(url, this.options)
      .map(res => {
        console.log(res);
        return res.json();
      });
  }

  //dapatkan data user sesuai pagination
  getUserSearch(value: string) {
    var url = this.apiUrl2 + "users/search" + value;
    // console.log("data url : ", url);
    return this.http.get(url, this.options)
      .map(res => {
        console.log(res);
        return res.json();
      });
  }

  //dapatkan data user sesuai pagination
  getUserSearchCount(value: string) {
    var url = this.apiUrl2 + "users/searchcount?" + value;
    // console.log("data url : ", url);
    return this.http.get(url, this.options)
      .map(res => {
        console.log(res);
        return res.json();
      });
  }

  //dapatkan data user sesuai pagination
  getUserRoleByID(value: string) {
    var url = this.apiUrl2 + "users/roles/" + value;
    // console.log("data url : ", url);
    return this.http.get(url, this.options)
      .map(res => {
        // console.log(res);
        return res.json();
      });
  }

  getAllRoles(): any {
    return this.http.get(this.apiUrl2 + 'users/roles', this.options)
      .map(res => {
        return res.json();
      });
  }

  cekUsername(username: string) {
    // console.log('value yang dikirimkan : ', username);
    return this.http.post(this.apiUrl2 + 'users/usernamecek', { 'username': username }, this.options)
      .map(res => {
        console.log(res.json());
        return res.json();
      });
  }

  changeEnable(value:boolean, id:number ){
    // console.log(value , id);
    var url = this.apiUrl2 +"users/enable";
    // console.log(url);
    return this.http.post(url, { 'value': value, "id" : id }, this.options)
    .map(res => {
      console.log(res.json());
      return res.json();
    });
  }



}//end
