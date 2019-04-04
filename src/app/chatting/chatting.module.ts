import {NgModule} from '@angular/core';
import {ChattRoutingModule} from "./chatting.routing";
import {AdminChatScreenComponent} from "./admin-screen/admin-screen.component";
import {UserChatScreenComponent} from "./user-screen/user-screen.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {AppMaterialModule} from "../app-material/app-material.module";
import { ChattingComponent } from './chatting.component';



@NgModule({
  imports: [
    ChattRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AppMaterialModule
  ],
  declarations: [
    ChattingComponent,
    AdminChatScreenComponent,
    UserChatScreenComponent,

  ],
  entryComponents: [ChattingComponent
  ],
  providers:[
  ]

})
export class ChattingModule {

}
