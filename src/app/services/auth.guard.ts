import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from "./auth.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private auth: AuthService,) { }


    // canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot
    // ): Observable<boolean> {
    //     return this.auth.isLoggedIn
    //         .map((isLoggedIn: boolean) => {
    //             if (!isLoggedIn){
    //                 this.router.navigate(['/login']);
    //                 return false;
    //             }
    //             return true;
    //         });
    // }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (JSON.parse(localStorage.getItem('token')) !== null) {
            // logged in so return true
            return true;
        }

        // if(this.auth.loggedIn){
        //   return true;
        // }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/access'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
