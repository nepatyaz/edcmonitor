import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable()
export class SocketService {
  private socket;
  socketID: string;
  serverUrl: string = "http://localhost:3000";
  userName : string;
 
  constructor() { 
    let myItem = JSON.parse(localStorage.getItem('currentUser'));
      this.userName = myItem.username;
  }

  sendMessage(message) {
    this.socket.emit('sendMessage', message);
  }

  setUser(){
    console.log('setting chat user...');
    let myItem = JSON.parse(localStorage.getItem('currentUser'));
    let data = {
      "username": myItem.username,
    }
    this.socket.emit('setUser', data);
  }

  connect() {
    this.socket = socketIo(this.serverUrl);
    this.socket.on('connect', () => {
      this.socketID = this.socket.id;
      console.log(this.socket.id); // an alphanumeric id...
    });
    this.setUser();
  }

  getMessages() {
    let observable = new Observable(observer => {
      // this.socket = socketIo(this.serverUrl);
      var listening = "messageData"+this.userName;
      this.socket.on(listening, (data) => {
        // observer.next(data);    
        observer.next(data); 
      });
      // return () => {
      //   this.socket.disconnect();
      // };
    }) 
    return observable;
  }

  setMessageData(data) {
    this.socket.emit('setChat', data);
  }

  setToRead(to_user, user){
    let data = {
      "username" : user,
      "to_user" : to_user
    }
    this.socket.emit('setToRead', data);
  }

  getUser() {
    let observable = new Observable(observer => {
      var listening = "getUser";
      this.socket.on(listening, (data) => { 
        // observer.next(data);    
        observer.next(data); 
      });
    }) 
    return observable;
  }

  disconnectUser(username){
    console.log(username);
    
    this.socket.emit('disconnectUser', username);
  }

  getAdminStatus(){
    this.socket.emit('getAdminStatus', '');

    let observable = new Observable(observer => {
      // this.socket = socketIo(this.serverUrl);
      var listening = "adminStatus";
      this.socket.on(listening, (data) => {
        // observer.next(data);    
        observer.next(data); 
      });
      // return () => {
      //   this.socket.disconnect();
      // };
    }) 
    return observable;
  }


}
