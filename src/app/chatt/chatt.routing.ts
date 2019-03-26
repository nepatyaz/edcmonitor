import {NgModule}                from '@angular/core';
import {RouterModule, Routes}    from '@angular/router';
import { CommonModule } from '@angular/common';
import {ChattComponent} from "./chatt.component";
import {AuthGuard} from "../services/auth.guard";
import {AdminScreenComponent} from "./admin-screen/admin-screen.component";
import {DeviceTableComponent} from "../device-table/device-table.component";
import {UserDeviceComponent} from "../device-table/user-device/user-device.component";
import {AdminDeviceComponent} from "../device-table/admin-device/admin-device.component";
import {UserScreenComponent} from "./user-screen/user-screen.component";

const materialRoutes: Routes = [
  {
    path: '',
    component: ChattComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-screen',
    component: AdminScreenComponent
  },
  {
    path: 'user-screen',
    component: UserScreenComponent
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

