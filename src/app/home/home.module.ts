import {NgModule} from '@angular/core';
import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home.routing";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {AgmCoreModule} from "@agm/core";
import {AppMaterialModule} from "../app-material/app-material.module";
import {TickerDirective} from "./ticker.directive";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ChartsModule} from "ng2-charts";

@NgModule({
  imports: [
    HomeRoutingModule,
    // AgmCoreModule.forRoot({
    //   apiKey: ' AIzaSyD7LydY0W-BBhCnDNKH-g7jUFg-4UIAPPk ',
    //   libraries: ["places"]
    // }),
    AgmCoreModule,
    CommonModule,
    ChartsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppMaterialModule,
    NgxChartsModule,
    LeafletModule.forRoot()
  ],
  declarations: [HomeComponent, TickerDirective],
  providers: [],
})
export class HomeModule {


}
