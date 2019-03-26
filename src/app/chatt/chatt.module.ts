import {NgModule} from '@angular/core';
import {ChattComponent} from "./chatt.component";
import {ChattRoutingModule} from "./chatt.routing";
import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { UserScreenComponent } from './user-screen/user-screen.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DataTableModule} from "angular2-datatable";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {AppMaterialModule} from "../app-material/app-material.module";
import {StompConfig, StompService} from "@stomp/ng2-stompjs";

const stompConfig: StompConfig = {
  // Which server?
  url: 'ws://127.0.0.1:3000/socket',

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: true
};

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
    ChattComponent,
    AdminScreenComponent,
    UserScreenComponent,

  ],
  entryComponents: [ChattComponent
  ],
  providers:[
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ]

})
export class ChattModule {

}
