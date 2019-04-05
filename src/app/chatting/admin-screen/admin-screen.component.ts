import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SocketService } from '../../services/socket.service';
import { Subscription, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import * as $ from 'jquery';
import { debounce } from './decorator';


declare var $: any;

@Component({
  selector: 'admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.scss']
})
export class AdminChatScreenComponent implements OnInit, OnDestroy {

  userAvatar;
  userName;

  messageData;
  allUser : any;
  userSelected: string;
  userAvatarSelected;
  userLoginSelected: boolean = false;
  roomSelected: boolean = false;


  socketInit: any;
  ioGetMessage: Subscription;
  ioGetUser: Subscription;

  @HostListener('scroll', ['$event'])
  @debounce()



  public scrollHandler() {
    let obj = document.getElementById('markMessageHistory');
    let objScrollHeight = Math.round((obj.scrollTop) * 100) / 100;
    // console.log("objek :",objScrollHeight);
    // console.log("scrollHeight height",obj.scrollHeight);
    if ((obj.scrollHeight - objScrollHeight) < 305) {
      // console.log(this.userSelected);
      this.socketService.setToRead(this.userSelected, this.userName);
    }
  }

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
    this.ioGetUser = this.socketService.getUser().subscribe(data => {
      //  console.log(data);
      this.allUser = data;
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
    }, 1000);

    // this.getAllUser();

    var scrollElement = document.getElementById('markMessageHistory');
    var mousedown = Observable.fromEvent(scrollElement, 'scroll');

  }

  getAllUser() {
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
      "to_user": this.userSelected
    }

    console.log("Kirim Pesan :  ", message);
    $('#textMessage').val('');
    this.socketService.sendMessage(messageData)

  }

  ngOnDestroy() {

    if (this.ioGetMessage !== null) {
      this.ioGetMessage.unsubscribe();
    }
    this.socketService.disconnectUser(this.userName);

  }

  selectedUser(data) {
    // console.log(data.avatar);
    this.userSelected = data.username;
    this.userAvatarSelected = data.avatar;
    this.userLoginSelected = data.is_login;
    this.roomSelected = true;
    this.setMessageData(data.username);
  }

}