import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort} from "@angular/material";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DeviceService} from "../services/device.service";
import {Device} from "../models/device";
import {SearchData} from "../models/searchdata";
import {AuthService} from "../services/auth.service";
import {User} from "../models";

@Component({
  selector: 'app-device-table',
  templateUrl: './device-table.component.html',
  styleUrls: ['./device-table.component.scss']
})
export class DeviceTableComponent implements OnInit {

  currentUser: User = new User;
  isShow:boolean = false;

  constructor(public dialog: MatDialog,
              private router: Router,
              public auth: AuthService,
              private deviceService: DeviceService) {

    //this.checkAdmin();

    if(this.auth.isAdmin){
      this.isShow = true;
    }
    console.log('this.isShow ', this.isShow);
  }


  ngOnInit() {
    //this.checkAdmin();
  }

  // checkAdmin(){
  //   let admin = localStorage.getItem('isAdmin');
  //   console.log('localstorage isAdmin ', admin);
  //   if(admin === 'true'){
  //     console.log('isAdmin' , this.auth.isAdmin);
  //     this.isShow = true;
  //   }
  // }


}


