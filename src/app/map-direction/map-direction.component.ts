import { Component, OnInit } from '@angular/core';
// import { DirectionsMapDirective } from "./google-map.directive";
// import { DialogExampleComponent } from "../dialogs/dialog-example/dialog-example.component";
// import { MatDialog, MatDialogConfig } from "@angular/material";
// import { GoogleMapsAPIWrapper, MapsAPILoader } from "@agm/core";
import * as $ from 'jquery';
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

declare var $: any;
// declare var google: any;
// declare var jQuery: any;

@Component({
  selector: 'app-map-direction',
  templateUrl: './map-direction.component.html',
  styleUrls: ['./map-direction.component.scss']
})
export class MapDirectionComponent implements OnInit {

  public lat: Number = -6.9813947
  public lng: Number = 110.4132883

  public origin: any
  public destination: any

  constructor(private ngxService: NgxUiLoaderService) {
    this.getDirection();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  getDirection() {
    console.log("direction start ");

    var start = JSON.parse(localStorage.getItem("start"));
    var finish = JSON.parse(localStorage.getItem("finish"));
    console.log("star", start.latitude, start.longitude);
    console.log("finish", finish.latitude, finish.longitude);

    var startLat = parseFloat(start.latitude);
    var startLon = parseFloat(start.longitude);

    var finishLat = parseFloat(finish.latitude);
    var finishLon = parseFloat(finish.longitude);

    this.origin = { lat: startLat, lng: startLon }
    this.destination = { lat: finishLat, lng: finishLon }
    this.ngxService.stopAll();
  }

  public renderOptions = {
    suppressMarkers: true,
  }

  public markerOptions = {
    origin: {
      icon: '/assets/icon/blu_map.png',
      draggable: true,
    },
    destination: {
      icon: '/assets/icon/blu_map.png',
      label: 'MARKER LABEL',
      opacity: 0.8,
    },
  }

}