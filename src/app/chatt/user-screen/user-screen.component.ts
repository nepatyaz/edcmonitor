import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { User } from "../../models";
import { Message } from '@stomp/stompjs';
import { MessageChat } from "../../models/message";
import { StompService } from "@stomp/ng2-stompjs";
import { MessageService } from "../../services/message.services";
import { SearchData } from "../../models/searchdata";
import { AuthService } from "../../services/auth.service";
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
  selector: 'app-user-screen',
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.scss']
})
export class UserScreenComponent implements OnInit, OnDestroy {

  searchData: SearchData = new SearchData();
  currentUser: User = new User();
  toUser: User = new User();
  chat: MessageChat = new MessageChat();
  chats: MessageChat[] = [];
  text: string = "";

  // Stream of messages
  private subscription: Subscription;
  public messages: Observable<Message>;

  // Subscription status
  public subscribed: boolean;

  // Array of historic message (bodies)
  public mq: Array<string> = [];


  /** Constructor */
  constructor(private _stompService: StompService,
    private auth: AuthService,
    private messageService: MessageService,
    private ngxService: NgxUiLoaderService
  ) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('currentUser ', this.currentUser);
    this.chat.username = this.currentUser.username;
    this.searchData.searchKey = this.currentUser.username;

    this.getMessageByUsername(this.searchData);

  }

  getMessageByUsername(searchKey: SearchData) {
    this.messageService.getMessageByUsername(this.searchData)
      .subscribe(res => {

        this.chats = res;
      }, error => {
        console.log('error ', error.message);
      });
  }

  ngAfterViewInit(){
    this.ngxService.stop();
  }

  ngOnInit() {
    this.subscribed = false;

    // Store local reference to Observable
    // for use with template ( | async )
    this.subscribe();
  }

  public subscribe() {
    if (this.subscribed) {
      return;
    }

    // Stream of messages
    this.messages = this._stompService.subscribe('/chat');

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
      this.chat.toUser = "admin";
      this.chat.message = this.text;
      this.chat.isRead = false;

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

    if (msg.username === this.currentUser.username) {
      this.chats.push(JSON.parse(message.body));
    }

    // Log it to the console
    console.log(message.body);
  }


}//

