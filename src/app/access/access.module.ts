import { NgModule } from '@angular/core';
import { AccessComponent } from "./access.component";
import { AccessRoutingModule } from "./access.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { AppMaterialModule } from "../app-material/app-material.module";



@NgModule({
  imports: [
    AccessRoutingModule,
    AppMaterialModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [AccessComponent]
})
export class AccessModule {

}


