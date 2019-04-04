import {NgModule}                from '@angular/core';
import {RouterModule, Routes}    from '@angular/router';
import { CommonModule } from '@angular/common';
import {ChattingComponent} from "./chatting.component";
import {AuthGuard} from "../services/auth.guard";
import {AdminChatScreenComponent} from "./admin-screen/admin-screen.component";
import {UserChatScreenComponent} from "./user-screen/user-screen.component";

const materialRoutes: Routes = [
  {
    path: '',
    component: ChattingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-screen',
    component: AdminChatScreenComponent
  },
  {
    path: 'user-screen',
    component: UserChatScreenComponent
  },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(materialRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChattRoutingModule {

}

