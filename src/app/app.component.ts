import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from "rxjs/Subscription";
import { Router } from "@angular/router";
import { User } from "./models";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Dashboard';
  showLoader: boolean;



  @ViewChild('sidenav') sidenav: any;
  opened: any = false;

  currentUser: User = new User;
  isLink: boolean = true;

  constructor(public dialog: MatDialog,
    private router: Router,
    public auth: AuthService,
    private ngxService: NgxUiLoaderService,
    private userService: UserService) {


    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('this.currentUser ', this.currentUser);
    if (this.currentUser !== null) {
      this.auth.loggedIn.next(true);
      console.log('this.loggedIn ', this.auth.loggedIn);
    }
  }

  ngOnInit() {
    // this.ngxService.start();
    $(window).scroll(function () {
      if ($(window).scrollTop() > 10) {
        $('#navBar').addClass('floatingNav');
      } else {
        $('#navBar').removeClass('floatingNav');
      }
    });

    setTimeout(() => {
      this.ngxService.stopAll();
      
    }, 40000);
  }



  getUserEmail(user: User) {
    return user.email;
  }


  signOut() {

    // if (this.sidenav.opened) {
    //   this.sidenav.opened = false;
    // }

    // this.auth.logout()
    //   .subscribe(res => {

        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isVendor');
        localStorage.removeItem('isGuest');
        localStorage.removeItem('isUser');
        localStorage.removeItem('isLogin');
        this.auth.isAdmin = false;
        this.auth.isVendor = false;
        this.auth.isGuest = false;
        this.auth.isUser = false;
        this.auth.isLogin = false;
        this.auth.loggedIn.next(false);
        this.router.navigate(['/access']);

    //   });
    // this.router.navigate(['/access']);
  }


  onClick() {
    // if (this.sidenav.opened) {
    //   //this.sidenav.opened = true;
    // }
  }

  ngOnDestroy() {

  }

}
