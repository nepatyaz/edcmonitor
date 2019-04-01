import { Component, OnInit, OnDestroy } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { UserService } from '../services/user.service';

export interface message {
  id_message: string;
  created_at: string;
  is_read: string;
  message : string;
  to_user : string;
  username : string;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  userAvatar;
  userName; 

  messageData;
  allUser: any[] = [];
  userSelected : string ;
  userAvatarSelected ;
  roomSelected : boolean = false;


  socketInit: any;
  ioConnection: Subscription;

  constructor(private ngxService: NgxUiLoaderService, private socketService: SocketService, private userService: UserService) {
    let userItem = JSON.parse(localStorage.getItem('currentUser'));
    this.userAvatar = userItem.avatar;
    this.userName = userItem.username;
   }

  ngAfterViewInit() {
    this.ngxService.stop();
  }

  ngOnInit() {
    this.socketService.connect();
    this.ioConnection = this.socketService.getMessages().subscribe(data => {
      this.messageData = data;
      console.log("data from socket: ", this.messageData);
    },
      () => {
        console.log("disconected from server");
      });

    setTimeout(() => {
      console.log("no id : ", this.socketService.socketID);
    }, 1000);

    this.getAllUser();

  }

  getAllUser(){
    this.userService.getAllUser()
      .subscribe(users => {
        this.allUser = users;
        console.log(this.allUser);
      }, err => {
        console.log('error ', err);
      });

  }


  setMessageData(toUser) {

    let myItem = JSON.parse(localStorage.getItem('currentUser'));
    let messageData = {
      "userName": myItem.username,
      "toUser": toUser,
      "socketId" : this.socketService.socketID
    }

    console.log("set chat", messageData);
    this.socketService.setMessageData(messageData);

   
  }


  sendMessage() {

    let myItem = JSON.parse(localStorage.getItem('currentUser'));
    console.log("isi Storage ", myItem.username);

    let messageData = {
      "username": myItem.username,
      "message": "pesan"
    }

    console.log("Kirim Socket ");
    //this.socketService.sendMessage(messageData);
    // this.setMessageData();
  }

  ngOnDestroy() {

    if (this.ioConnection !== null) {
      this.ioConnection.unsubscribe();
    }

  }

  selectedUser(data){
    // console.log(data.avatar);
    this.userSelected = data.username;
    this.userAvatarSelected = data.avatar;
    this.roomSelected = true;
    this.setMessageData(data.username);
  }

}


export enum Action {
  JOINED,
  LEFT,
  RENAME
}

// Socket.io events
export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect'
}