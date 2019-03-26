import {AccountComponent} from "./account.component";
import {AuthGuard} from "../services/auth.guard";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UsersComponent} from "./users/users.component";
import {RegisterComponent} from "./register/register.component";
import {EditFormComponent} from "./edit-form/edit-form.component";
import {ViewFormComponent} from "./view-form/view-form.component";

const accountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'edit-form/:id',
    component: EditFormComponent
  },
  {
    path: 'view-form/:id',
    component: ViewFormComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // {
  //   path: 'password',
  //   component: PasswordComponent
  // }

];

@NgModule({
  imports: [
    RouterModule.forChild(accountRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {

}

