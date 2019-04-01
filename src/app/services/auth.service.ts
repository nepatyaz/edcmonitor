import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from "../models/user";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";
import { Subscriber } from "rxjs/Subscriber";
import { BehaviorSubject } from "rxjs/BehaviorSubject";




@Injectable()
export class AuthService {

  apiUrl = "http://127.0.0.1:3000";

  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public onAuthChange$: Subject<User> = new Subject<User>();
  public currentUser$: Observable<User> = new Observable<User>();

  //isLogin
  public _isLogin: Subject<boolean> = new Subject<boolean>();
  public isLogin: boolean = false;
  public isLogin$: Observable<boolean> = this._isLogin.asObservable();

  //administrator
  public _isAdmin: Subject<boolean> = new Subject<boolean>();
  public isAdmin: boolean = false;
  public isAdmin$: Observable<boolean> = this._isAdmin.asObservable();

  //guest
  public _isGuest: Subject<boolean> = new Subject<boolean>();
  public isGuest: boolean = false;
  public isGuest$: Observable<boolean> = this._isGuest.asObservable();

  //vendor
  public _isVendor: Subject<boolean> = new Subject<boolean>();
  public isVendor: boolean = false;
  public isVendor$: Observable<boolean> = this._isVendor.asObservable();

  //user
  public _isUser: Subject<boolean> = new Subject<boolean>();
  public isUser: boolean = false;
  public isUser$: Observable<boolean> = this._isUser.asObservable();

  constructor(private httpClient: HttpClient,
    private http: Http,
    private router: Router) { }



  login(username: string, password: string) {

    let bodyPost = {
      username: username,
      password: password
    };

    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.httpClient.post<any>(this.apiUrl + '/authenticate',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
      .map(data => {
        //console.log('login token ', data);
        // login successful if there's a jwt token in the response
        if (data) {

          console.log('token ', data.token);
          console.log('user ', data.user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes

          // if(localStorage.getItem('access_token') !== null){
          //   console.log('remove access_token');
          //   localStorage.removeItem('access_token');
          // }
          localStorage.setItem('token', JSON.stringify(data.token));
          localStorage.setItem('currentUser', JSON.stringify(data.user));

          // this.storage.setItem('currentUser', data.user)
          //   .subscribe(() => {}, () => {});
          //
          // this.storage.setItem('token', data.token)
          //   .subscribe(() => {}, () => {});


          this.setCurrentUser(data.user);
          localStorage.setItem('isLogin', 'true');
          this.isLogin = true;

          //administrator
          for (let i = 0; i < data.user.roles.length; i++) {
            if (data.user.roles[i] === 'ROLE_ADMIN') {
              localStorage.setItem('isAdmin', 'true');
              this.isAdmin = true;
              return;

            } else if (data.user.roles[i] === 'ROLE_GUEST') {
              localStorage.setItem('isGuest', 'true');
              this.isGuest = true;
              return;

            } else if (data.user.roles[i] === 'ROLE_VENDOR') {
              localStorage.setItem('isVendor', 'true');
              this.isVendor = true;
              return;

            } else if (data.user.roles[i] === 'ROLE_USER') {
              localStorage.setItem('isUser', 'true');
              this.isUser = true;
            }
          }

          this.loggedIn.next(true);
          this.router.navigate(['/']);


        }

        return data.json();
      });
  }

  getisLogin(): boolean {

    if (localStorage.getItem('isLogin') === 'true') {
      this.isLogin = true;
    }
    return this.isLogin;
  }


  getGuest(): boolean {

    if (localStorage.getItem('isGuest') === 'true') {
      this.isGuest = true;
    }
    return this.isGuest;
  }

  getVendor(): boolean {

    if (localStorage.getItem('isVendor') === 'true') {
      this.isVendor = true;
    }
    return this.isVendor;
  }

  getUser(): boolean {

    if (localStorage.getItem('isUser') === 'true') {
      this.isUser = true;
    }
    return this.isUser;
  }

  getAdmin(): boolean {
    if (localStorage.getItem('isAdmin') === 'true') {
      this.isAdmin = true;
    }
    return this.isAdmin;
  }

  getRoleAdd(): boolean {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    for (let i = 0; i < currentUser.roles.length; i++) {
      let role: string = currentUser.roles[i];
      if (role === "ROLE_ADD") {
        return true;
      } else {
        return false;
      }
    }
  }

  getRoleEdit(): boolean {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    for (let i = 0; i < currentUser.roles.length; i++) {
      let role: string = currentUser.roles[i];
      if (role === "ROLE_EDIT") {
        return true;
      } else {
        return false;
      }
    }
  }

  getRoleDelete(): boolean {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    for (let i = 0; i < currentUser.roles.length; i++) {
      let role: string = currentUser.roles[i];
      if (role === "ROLE_DELETE") {
        return true;
      } else {
        return false;
      }
    }
  }


  setCurrentUser(user: User) {

    this.currentUser$ = new Observable<User>((observer: Subscriber<User>) => {
      observer.next(user);
    });
    this.onAuthChange$.next(user);

  }

  logout(): any {

    let usr: User = JSON.parse(localStorage.getItem('currentUser'));
    let headers = new Headers({
      "Authorization": "Bearer " + JSON.parse(localStorage.getItem('token')),
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isVendor');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('isUser');
    localStorage.removeItem('isLogin');
    this.isAdmin = false;
    this.isVendor = false;
    this.isGuest = false;
    this.isUser = false;
    this.isLogin = false;
    this.loggedIn.next(false);
    this.router.navigate(['/access']);

    return this.http.post(this.apiUrl + '/api/users/logout', usr, options)
      .map(res => {
        console.log('logout resp ', res.json());



        return res.json()

      });
  }

  getUserInfo(token: any): any {

    let currentUser: User = new User();

    //console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.apiUrl + '/api/whoami', options)
      .map(res => res.json())
      .subscribe(data => {

        //console.log('data ', data);
        //console.log('data ', data.username);

        currentUser.id = data.id;
        currentUser.roles = data.roles;
        currentUser.email = data.email;
        currentUser.enabled = data.enabled;
        currentUser.lastPasswordResetDate = data.lastPasswordResetDate;

        console.log('currentUser ', currentUser);


        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // if(localStorage.getItem('currentUser') !== null){
        //   localStorage.removeItem('currentUser');
        // }
        localStorage.setItem('currentUser', JSON.stringify(currentUser));



        return currentUser;
      });
  }

  getCurrentUser(): User {

    return JSON.parse(localStorage.getItem('currentUser'));
  }

  getUserAvatar(): string {

    let usr: User = JSON.parse(localStorage.getItem('currentUser'));
    return usr.avatar;
  }

  getToken(): any {

    return JSON.parse(localStorage.getItem('access_token'));
  }

  logoutz() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isVendor');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('isUser');
    localStorage.removeItem('isLogin');
    this.isAdmin = false;
    this.isVendor = false;
    this.isGuest = false;
    this.isUser = false;
    this.isLogin = false;
    this.loggedIn.next(false);
    this.router.navigate(['/access']);
  }

  getAllUser(token: any) {

    let currentUser: User = new User();

    console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.apiUrl + '/api/user/all', options)
      .map(res => res.json())
      .subscribe(data => {

        console.log('data ', data);
        //console.log('data ', data.username);

        // currentUser.id = data.id;
        // currentUser.authorities = data.authorities;
        // currentUser.email = data.email;
        // currentUser.firstName = data.firstName;
        // currentUser.lastName = data.lastName;
        // currentUser.enabled = data.enabled;
        // currentUser.lastPasswordResetDate = data.lastPasswordResetDate;
        // currentUser.phoneNumber = data.phoneNumber;
        //
        // console.log('currentUser ', currentUser);

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // if(localStorage.getItem('currentUser') !== null){
        //   localStorage.removeItem('currentUser');
        // }
        //localStorage.setItem('currentUser', JSON.stringify(currentUser));


      });
  }

  getAllRole(token: any) {

    let currentUser: User = new User();

    console.log("token ", token);
    let headers = new Headers({
      "Authorization": "Bearer " + token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.apiUrl + '/api/device', options)
      .map(res => res.json())
      .subscribe(data => {

        console.log('data ', data);

        localStorage.setItem('roles', JSON.stringify(data));


      });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
