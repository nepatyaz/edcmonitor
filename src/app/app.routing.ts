import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "./services/auth.guard";
import {ChartComponent} from "./chart/chart.component";
import {WebsocketComponent} from "./websocket/websocket.component";
import { TesComponent } from './tes/tes.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'access',
    loadChildren: './access/access.module#AccessModule'
  },
  {
    path: 'account',
    loadChildren: './account/account.module#AccountModule'
  },
  {
    path: 'device-table',
    loadChildren: './device-table/device-table.module#DeviceModule'
  },
  {
    path: 'maps',
    loadChildren: './map-direction/map-direction.module#MapsModule'
  },
  {
    path: 'chat',
    loadChildren: './chatt/chatt.module#ChattModule'
  },
  {
    path: 'websocket',
    component: WebsocketComponent
  },
  {
    path: 'test',
    component: TesComponent 
  },
  {
    path: 'chatting',
    loadChildren: './chatting/chatting.module#ChattingModule'
  },

  {
    path: 'datatable',
    loadChildren: './demo-table/demo-table.module#DemoModule'
  },

];

export const appRoutingProviders: any[] = [
  AuthGuard
];
export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
