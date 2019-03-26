import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Http, RequestOptions } from '@angular/http';
import { User } from "../models/user";

@Injectable()
export class UserService {
  apiUrl = "http://127.0.0.1:3000";

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
      'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Methods': 'DELETE'
    });
    let options = new RequestOptions({ headers: headers });
    console.log
    return this.http.delete('delete/users/' + id, options)
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
      .map(res => {
        console.log('users', res.json());
        return res.json();
      });
  }






}//end
