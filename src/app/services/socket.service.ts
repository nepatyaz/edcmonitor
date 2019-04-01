import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable()
export class SocketService {
  private socket;
  socketID: string;
  serverUrl: string = "http://localhost:3100";
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
      console.log("listening on : ", listening)
      this.socket.on(listening, (data) => {
        // observer.next(data);    
        observer.next(data); 
      });
      return () => {
        this.socket.disconnect();
      };
    }) 
    return observable;
  }


  setMessageData(data) {
    this.socket.emit('setChat', data);
  }

  messageWatch(data){
    console.log(data);
    // setInterval(()=>{
      this.socket.emit('requestmessage', data);
    // },1000);

  }


}
