import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {DataTableModule} from "angular2-datatable";
import {AccountComponent} from "./account.component";
import {DataFilterPipe} from "../demo-table/data-filter.pipe";
import {AccountRoutingModule} from "./account.routing";
import {UsersComponent} from "./users/users.component";
import { UserFormComponent } from './user-form/user-form.component';
import {AppMaterialModule} from "../app-material/app-material.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {HttpModule} from "@angular/http";
import {CommonModule} from "@angular/common";
import { RegisterComponent } from './register/register.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { ViewFormComponent } from './view-form/view-form.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AccountRoutingModule,
    DataTableModule,
    AppMaterialModule
  ],
  declarations: [AccountComponent,
                 DataFilterPipe,
                 UsersComponent,
                 UserFormComponent,
                 RegisterComponent,
                 EditFormComponent,
                 ViewFormComponent,
                 ],
  entryComponents: [UserFormComponent],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AccountModule {
}
