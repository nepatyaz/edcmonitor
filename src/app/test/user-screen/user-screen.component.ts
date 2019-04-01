import { Component, OnInit } from '@angular/core';
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
export class UserScreenComponent implements OnInit {

  userAvatar;
  userName;

  messageData;
  allUser: any[] = [];
  userSelected: string;
  userAvatarSelected;
  roomSelected: boolean = false;

  socketInit: any;
  ioConnection: Subscription;
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
    this.ioConnection = this.socketService.getMessages().subscribe(data => {
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

}
