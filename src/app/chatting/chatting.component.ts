import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import { AsyncLocalStorage } from 'angular-async-local-storage';
import {PlatformLocation} from "@angular/common";
import {User} from "../models";
import {MessageChat} from "../models/message";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {DeviceService} from "../services/device.service";
import {MatDialog} from "@angular/material";


@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.scss']
})
export class ChattingComponent implements OnInit {

  currentUser: User = new User;
  isShow:boolean = false;

  constructor(public dialog: MatDialog,
              private router: Router,
              private auth: AuthService,
              private deviceService: DeviceService) {

    //this.checkAdmin();

    if(this.auth.isAdmin){
      this.isShow = true;
    }
    console.log('this.isShow ', this.isShow);
  }


  ngOnInit() {


  }


  ngOnDestroy() {



  }

}//end
