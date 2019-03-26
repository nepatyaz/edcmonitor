import {Component, OnDestroy, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Message} from '@stomp/stompjs';
import { Subscription } from 'rxjs/Subscription';
import {StompService} from '@stomp/ng2-stompjs';
import {MessageChat} from "../models/message";
import {User} from "../models";



@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit, OnDestroy {

  currentUser: User = new User();
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
  constructor(private _stompService: StompService) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.chat.username = this.currentUser.username;

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
      this.chat.message = this.text
      this._stompService.publish("/app/send/message", JSON.stringify(this.chat));
      this.text = '';
    }
  }


  /** Consume a message from the _stompService */
  public on_next = (message: Message) => {

    // Store message in "historic messages" queue
    this.mq.push(message.body + '\n');

    this.chats.push(JSON.parse(message.body));
    // Log it to the console
    console.log(message.body);
  }


}
