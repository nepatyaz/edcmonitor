import {NgModule}                from '@angular/core';
import {RouterModule, Routes}    from '@angular/router';
import {MapDirectionComponent} from "./map-direction.component";
import {AuthGuard} from "../services/auth.guard";


const MapsRoutes: Routes = [
  {
    path: '',
    component: MapDirectionComponent,
    canActivate: [AuthGuard],

  }
];

@NgModule({
  imports: [
    RouterModule.forChild(MapsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MapsRoutingModule {

}

