import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {DialogExampleComponent} from "../dialogs/dialog-example/dialog-example.component";
import {User} from "../models";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import * as $ from 'jquery';


import { from } from 'rxjs/observable/from';

declare var $: any;

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
    styleUrls: ['./access.component.css','./access.component.scss']
})
export class AccessComponent implements OnInit, OnDestroy {

    token: string = "";
    public user = new User();
    public rememberMe: boolean = true;
    errorMessage: string;
    actionTitle: string = "Login";
    subLogin:Subscription;

    constructor(private router: Router,
                private dialog: MatDialog,
                public auth: AuthService,
                private ngxService: NgxUiLoaderService,
                private userService: UserService) {

        //let user = this.auth.getCurrentUserData();
      let user = JSON.parse(localStorage.getItem("currentUser"));
      if (this.auth.loggedIn) {
            this.router.navigate(['/home']);
        }else{
            this.router.navigate(['/access']);
        }
    }

    ngOnInit() {
      this.ngxService.stop();

      if (this.auth.loggedIn) {
        this.router.navigate(['/home']);
      }else{
        this.router.navigate(['/access']);
      }
        //let user = this.auth.getCurrentUserData();
      // let user = JSON.parse(localStorage.getItem("currentUser"));
      //   if (user !== null) {
      //       this.router.navigate(['/home']);
      //   }else{
      //       this.router.navigate(['/access']);
      //   }
      //   // this.app.setTitle("Login to access the dashboard system.");

      // Parallax
      var currentX : any = '';
      var currentY: any = '';
      var movementConstant = .015;
      $(document).mousemove(function(e) {
        if(currentX == '') currentX = e.pageX;
        var xdiff = e.pageX - currentX;
        currentX = e.pageX;
        if(currentY == '') currentY = e.pageY;
        var ydiff = e.pageY - currentY;
        currentY = e.pageY; 
        $('.parallax div').each(function(i, el) {
            var movement = (i + 1) * (xdiff * movementConstant);
          var movementy = (i + 1) * (ydiff * movementConstant);
            var newX = $(el).position().left + movement;
          var newY = $(el).position().top + movementy;
            $(el).css('left', newX + 'px');
          $(el).css('top', newY + 'px');
        });
      });
    
    }

    onSubmit() {

        this.actionTitle = "Please wait...";
        this.errorMessage = null;

        this.subLogin = this.auth.login(this.user.username, this.user.password)
            .subscribe(token => {
                    //console.log('token ', token.user);

                    return this.router.navigate(['/']);
                }
                , err => {
                    this.actionTitle = "Login";
                    this.errorMessage = err.message;
                    // this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
                    //     data: 'Failed connect to server'
                    // });
                });
    }

    ngOnDestroy(){
        if(this.subLogin) {
            this.subLogin.unsubscribe();
        }
    }

}
