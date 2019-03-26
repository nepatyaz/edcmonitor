import {AgmCoreModule, GoogleMapsAPIWrapper} from "@agm/core";
import {DeviceTableComponent} from "./device-table.component";
import {DeviceTableRoutingModule} from "./device-table.routing";
import {NgModule} from "@angular/core";
import { AddDeviceComponent } from './add-device/add-device.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { ViewDeviceComponent } from './view-device/view-device.component';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppMaterialModule} from "../app-material/app-material.module";
import {AccountRoutingModule} from "../account/account.routing";
import {DataTableModule} from "angular2-datatable";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { UserDeviceComponent } from './user-device/user-device.component';
import { AdminDeviceComponent } from './admin-device/admin-device.component';
import { TableByStatusComponent } from './table-by-status/table-by-status.component';
import {UpdateDeviceComponent} from "./update-device/update-device.component";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    DeviceTableRoutingModule,
    DataTableModule,
    AppMaterialModule
  ],
  declarations: [
    DeviceTableComponent,
    AddDeviceComponent,
    EditDeviceComponent,
    ViewDeviceComponent,
    UserDeviceComponent,
    AdminDeviceComponent,
    TableByStatusComponent,
    UpdateDeviceComponent
  ],
  entryComponents: [UpdateDeviceComponent],
  providers: [GoogleMapsAPIWrapper]
})
export class DeviceModule {

}
