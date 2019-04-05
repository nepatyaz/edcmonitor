import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { User } from "../models/user";
import * as socketIo from 'socket.io-client';

@Injectable()
export class UserService {
  apiUrl = "http://127.0.0.1:3000";
  apiUrl2 = "api/";

  constructor(private http: Http) { }


  headers = new Headers({
    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('token')),
    'Content-Type': 'application/json'
  }); 
  options = new RequestOptions({ headers: this.headers });

  getAll() {

    let token = JSON.parse(localStorage.getItem('token'));
    console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiUrl + '/api/user/all', options)
      .map(res => {
        console.log('users', res.json());
        return res.json();
      })

  }

  getById(id: number) {

    return this.http.get('/api/users/' + id);
  }

  create(user: User) {

    let token = JSON.parse(localStorage.getItem('token'));
    console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    let usr = user
    return this.http.post(this.apiUrl + '/register', user, options);
  }

  update(user: User) {

    let token = JSON.parse(localStorage.getItem('token'));
    console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.apiUrl + '/api/users', user, options);
  }

  delete(id: number) {

    let token = JSON.parse(localStorage.getItem('token'));
    console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    console.log
    return this.http.delete('http://localhost:3000/api/users/' + id, options)
      // return this.http.delete(this.apiUrl + '/api/users/' + id, options)
      .map(res => res.json())
  }

  getAllUser(): any {

    let token = JSON.parse(localStorage.getItem('token'));
    let users: User[] = [];

    //console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.apiUrl + '/api/users', options)
    // return this.http.get(this.apiUrl2 + 'users/', options)
      .map(res => {
        console.log('users', res.json());
        return res.json();
      });
  }

  cekUsername(username : string){
    let token = JSON.parse(localStorage.getItem('token'));

    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    console.log('value yang dikirimkan : ', username);
    return this.http.post(this.apiUrl2+'users/usernamecek', {'username' : username} , options)
    .map(res=> {
      console.log(res.json());
      return res.json();
    });
  }



}//end
