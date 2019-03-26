import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {AuthGuard} from "../services/auth.guard";
import {DeviceTableComponent} from "./device-table.component";
import {AddDeviceComponent} from "./add-device/add-device.component";
import {EditDeviceComponent} from "./edit-device/edit-device.component";
import {ViewDeviceComponent} from "./view-device/view-device.component";
import {UserDeviceComponent} from "./user-device/user-device.component";
import {AdminDeviceComponent} from "./admin-device/admin-device.component";
import {TableByStatusComponent} from "./table-by-status/table-by-status.component";


const deviceRoutes: Routes = [
  {
    path: '',
    component: DeviceTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-device',
    component: AdminDeviceComponent
  },
  {
    path: 'user-device/:id',
    component: UserDeviceComponent
  },
  {
    path: 'add-device',
    component: AddDeviceComponent
  },
  {
    path: 'edit-device/:id',
    component: EditDeviceComponent
  },
  {
    path: 'view-device/:id',
    component: ViewDeviceComponent
  },
  {
    path: 'device-by-status/:status',
    component: TableByStatusComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(deviceRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DeviceTableRoutingModule {

}

