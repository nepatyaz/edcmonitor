import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

import * as $ from 'jquery';

declare var $: any;

@Component({
  selector: 'app-user-screen',
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.scss']
})
export class UserScreenComponent implements OnInit, OnDestroy {

  userAvatar;
  userName;

  messageData;
  userSelected: string;
  userAvatarSelected;
  isAdminLogin : number = 0;
  roomSelected: boolean = false;

  socketInit: any;
  ioGetMessage: Subscription;
  ioGetAdminStatus: Subscription;
  socketIoConnection: Subscription;

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
    
    this.ioGetAdminStatus = this.socketService.getAdminStatus().subscribe(data => {
     this.isAdminLogin = data[0].is_login;
    },
      () => {
        console.log("disconected from server");
    });
    
    this.ioGetMessage = this.socketService.getMessages().subscribe(data => {
      this.messageData = data;
    },
      () => {
        console.log("disconected from server");
    });

    setTimeout(() => {
      console.log("no id : ", this.socketService.socketID);
      this.setMessageData();
    }, 1000);
  }

  setMessageData() {
    let myItem = JSON.parse(localStorage.getItem('currentUser'));
    let messageData = {
      "userName": myItem.username,
      "toUser": "admin",
      "socketId": this.socketService.socketID
    }
    console.log("set chat", messageData);
    this.socketService.setMessageData(messageData);
  }

  sendMessage() {
    var message = $('#textMessage').val();
    let myItem = JSON.parse(localStorage.getItem('currentUser'));
    let messageData = {
      "username": myItem.username,
      "message": message,
      "to_user": "admin"
    }

    console.log("kirim pesan : ", message );
    this.socketService.sendMessage(messageData)

  }

  ngOnDestroy() {

    if (this.ioGetMessage !== null) {
      this.ioGetMessage.unsubscribe();
    }
    this.socketService.disconnectUser(this.userName);
  }

}
