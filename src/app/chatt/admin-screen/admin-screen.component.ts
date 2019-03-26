import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {User} from "../../models";
import {MessageChat} from "../../models/message";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {SearchData} from "../../models/searchdata";
import {MessageService} from "../../services/message.services";
import {Observable} from "rxjs/Observable";
import {StompService} from "@stomp/ng2-stompjs";
import {Message} from '@stomp/stompjs';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {


  searchData: SearchData = new SearchData();
  allUser: any[] = [];
  chat: MessageChat = new MessageChat();
  chats: MessageChat[] = [];
  text: string = "";
  subRealtime: Subscription;
  subRealtimeAdd: Subscription;
  subRealtimeDelete: Subscription;
  subRealtimeUpdate: Subscription;
  subChatService: Subscription;
  subCount: Subscription;
  subFind: Subscription;
  subDialogRef: Subscription;
  subOnPageChange: Subscription;

  clickRoom: boolean = false;
  adminUser:boolean = false;
  administrator:boolean = false;
  customer:boolean = false;

  msgRoom: any;
  message: MessageChat = new MessageChat();
  currentUser: User = new User;

  chatRooms: any[] = [];
  chatRoom: User = new User();

  user: User = new User();
  withAdmin: User = new User();
  withUser: User = new User();

  // Stream of messages
  private subscription: Subscription;
  public messages: Observable<Message>;

  // Subscription status
  public subscribed: boolean;

  // Array of historic message (bodies)
  public mq: Array<string> = [];

  constructor(
    private _stompService: StompService,
    private auth: AuthService,
    private userService: UserService,
    private messageService: MessageService) {

    this.withUser = null;

    this.currentUser = this.auth.getCurrentUser();
    console.log('this.currentUser ', this.currentUser);

  }

  ngOnInit() {
    this.getAllUser();

    this.subscribed = false;
    // Store local reference to Observable
    // for use with template ( | async )
    this.subscribe();
  }

  getAllUser(){
    this.userService.getAllUser()
      .subscribe(users => {
        this.allUser = users;
      }, err => {
        console.log('error ', err);
      });

  }

  goChatRoom(user){

    console.log('click chat room ', user);
    this.clickRoom = true;
    this.chatRoom = user;
    this.searchData.searchKey = this.chatRoom.username;

    this.getMessageByUsername(this.searchData);
  }

  getMessageByUsername(searchKey: SearchData){
    this.messageService.getMessageByUsername(this.searchData)
      .subscribe(res => {

        this.chats = res;
      }, error => {
        console.log('error ', error.message);
      });
  }



  // WebSocket chat

  public subscribe() {
    if (this.subscribed) {
      return;
    }

    // Stream of messages
    this.messages = this._stompService.subscribe('/chat');
    console.log('this.messages ', this.messages);
    // Subscribe a function to be run on_next message
    this.subscription = this.messages.subscribe(this.on_next);

    this.subscribed = true;
  }

  public unsubscribe() {
    if (!this.subscribed) {
      return;
    }

    // This will internally unsubscribe from Stomp Broker
    // There are two subscriptions - one created explicitly, the other created in the template by use of 'async'
    this.subscription.unsubscribe();
    this.subscription = null;
    this.messages = null;

    this.subscribed = false;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  sendMessage() {
    if (this.text !== "") {
      this.chat.username = this.currentUser.username;
      this.chat.toUser = this.chatRoom.username;
      this.chat.message = this.text;
      this._stompService.publish("/app/send/message", JSON.stringify(this.chat));
      this.text = '';
    }
  }


  /** Consume a message from the _stompService */
  public on_next = (message: Message) => {

    // Store message in "historic messages" queue
    this.mq.push(message.body + '\n');

    let msg: MessageChat = new MessageChat();
    msg = JSON.parse(message.body);

    if((msg.username === this.currentUser.username &&
      msg.toUser === this.chatRoom.username) ||

      (msg.username === this.chatRoom.username ||
       msg.toUser === this.currentUser.username)){
      this.chats.push(JSON.parse(message.body));
    }
    // Log it to the console
    console.log(message.body);
  }

}//



