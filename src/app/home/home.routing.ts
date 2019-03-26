import {NgModule}                from '@angular/core';
import {RouterModule, Routes}    from '@angular/router';

import {HomeComponent} from "./home.component";
import {AuthGuard} from "../services/auth.guard";

const HomeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],

  }
];

@NgModule({
  imports: [
    RouterModule.forChild(HomeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule {

}

