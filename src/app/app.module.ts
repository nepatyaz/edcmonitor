import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { DialogExampleComponent } from "./dialogs/dialog-example/dialog-example.component";
import { AppRouting, appRoutingProviders } from "./app.routing";
import { AgmCoreModule } from "@agm/core";
import { AppMaterialModule } from "./app-material/app-material.module";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { HttpClientModule } from "@angular/common/http";
import { DataService } from "./services/data.service";
import { DialogService } from "./services/dialog.service";
import { DeviceService } from "./services/device.service";
import { ChartComponent } from './chart/chart.component';
import { WeatherService } from "./chart/weather.service";
import { ChartsModule } from 'ng2-charts';
import { WebsocketComponent } from './websocket/websocket.component';
import { StompRService } from "@stomp/ng2-stompjs";
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { MessageService } from "./services/message.services";
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { SocketService } from './services/socket.service';
import { AdminChatScreenComponent } from './chatting/admin-screen/admin-screen.component';
import { UserChatScreenComponent } from './chatting/user-screen/user-screen.component';




// const stompConfig: StompConfig = {
//   // Which server?
//   url: 'ws://localhost:8080/socket',
//
//   // Headers
//   // Typical keys: login, passcode, host
//   headers: {
//     login: 'guest',
//     passcode: 'guest'
//   },
//
//   // How often to heartbeat?
//   // Interval in milliseconds, set to 0 to disable
//   heartbeat_in: 0, // Typical value 0 - disabled
//   heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
//   // Wait in milliseconds before attempting auto reconnect
//   // Set to 0 to disable
//   // Typical value 5000 (5 seconds)
//   reconnect_delay: 5000,
//
//   // Will log diagnostics on console
//   debug: true
// };

@NgModule({
  declarations: [
    AppComponent,
    DialogExampleComponent,
    ChartComponent,
    WebsocketComponent,
    AdminChatScreenComponent,
    UserChatScreenComponent,
  ],
  entryComponents: [
    AppComponent,
    DialogExampleComponent
  ],
  imports: [
    BrowserModule,
    NgxUiLoaderModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRouting,
    ReactiveFormsModule,
    AppMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: ' AIzaSyD7LydY0W-BBhCnDNKH-g7jUFg-4UIAPPk ',
      //apiKey: 'AIzaSyCsZzejud5O8ZsaESHNkFvuyXROtQWKMow',
      libraries: ["places", "geometry"]
    }),
    ChartsModule
  ],
  providers: [appRoutingProviders,
    AuthService,
    DataService,
    DeviceService,
    UserService,
    DataService,
    DialogService,
    WeatherService,
    MessageService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
