import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapsRoutingModule } from "./map-direction.routing";
import { MapDirectionComponent } from "./map-direction.component";
import { DirectionsMapDirective } from "./google-map.directive";
import { AppMaterialModule } from "../app-material/app-material.module";
import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";
import { AgmDirectionModule } from 'agm-direction'



@NgModule({
  imports: [
    MapsRoutingModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyD7LydY0W-BBhCnDNKH-g7jUFg-4UIAPPk',
    }),
    AgmDirectionModule,     // agm-direction
  AgmCoreModule,
  AppMaterialModule,
  CommonModule,
  FormsModule,
  HttpModule,
  ReactiveFormsModule

  ],
  declarations: [MapDirectionComponent, DirectionsMapDirective],
  providers: [GoogleMapsAPIWrapper],
})
export class MapsModule {


}
