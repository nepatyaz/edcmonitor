import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {DialogExampleComponent} from "../dialogs/dialog-example/dialog-example.component";
import {User} from "../models";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";

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
