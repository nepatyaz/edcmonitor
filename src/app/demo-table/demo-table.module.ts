import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {CommonModule} from "@angular/common";
import {DemoRoutingModule} from "./demo-table.routing";
import {DemoTableComponent} from "./demo-table.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {DataFilterPipe} from "./data-filter.pipe";
import {DataTableModule} from "angular2-datatable";
import {AppMaterialModule} from "../app-material/app-material.module";




@NgModule({
    imports: [
      AppMaterialModule,
        DemoRoutingModule,
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        DataTableModule

    ],
    declarations: [DemoTableComponent, DataFilterPipe],
    bootstrap: [DemoTableComponent],
    providers: []
})
export class DemoModule {

}
