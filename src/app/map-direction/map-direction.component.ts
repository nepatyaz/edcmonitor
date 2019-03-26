import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {DirectionsMapDirective} from "./google-map.directive";
import {DialogExampleComponent} from "../dialogs/dialog-example/dialog-example.component";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {GoogleMapsAPIWrapper, MapsAPILoader} from "@agm/core";



declare var google:any;
declare var jQuery:any;

@Component({
  selector: 'app-map-direction',
  templateUrl: './map-direction.component.html',
  styleUrls: ['./map-direction.component.scss']
})
export class MapDirectionComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public mapCustomStyles : any;
  public estimatedTime: any;
  public estimatedDistance: any;

  private number: any;

  @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;

  public origin :any ; // its a example aleatory position
  public destination : any; // its a example aleatory position

  constructor(
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,
      private dialog: MatDialog,
      private gmapsApi: GoogleMapsAPIWrapper,
      private _elementRef : ElementRef) {}

  ngOnInit() {

    //set google maps defaults
    this.zoom = 4;
    this.latitude = -6.981529;
    this.longitude = 110.413563;


    //set current position
    let that = this;
    setTimeout(function () {
      that.setCurrentPosition();
    }, 20000);

    //this.setCurrentPosition();

     //let dataStart: MapStorage = JSON.parse(localStorage.getItem('start'));
    // let dataFinish: MapStorage = JSON.parse(localStorage.getItem('finish'));
    //
    // if(dataStart === null || dataFinish === null){
    //
    //   this.dialog.open(DialogExampleComponent, <MdDialogConfig>{
    //     data: 'Failed, get Current Position..'
    //   });
    //
    // }

    // if(dataStart !== null && dataFinish !== null){
    //
    //   let str = [ dataStart.latitude, dataStart.longitude];
    //   let end = [dataFinish.latitude, dataFinish.longitude];
    //
    //   this.origin = {latitude: str[0], longitude: str[1]};
    //   this.destination = {latitude: end[0], longitude: end[1]};
    //
    //
    // }

    let dataFinish: MapStorage = JSON.parse(localStorage.getItem('finish'));
    let elat = parseFloat(dataFinish.latitude);
    let elng = parseFloat(dataFinish.longitude);
    //console.log('dataFinish ', dataFinish.latitude);
    let end = [parseFloat(dataFinish.latitude), parseFloat(dataFinish.longitude)];
    this.origin = {latitude: this.latitude, longitude: this.longitude};
    this.destination = {latitude: end[0], longitude: end[1]};


    this.getDistanceAndDuration();
  }


  getDistanceAndDuration(){
    this.estimatedTime = this.vc.estimatedTime;
    this.estimatedDistance = this.vc.estimatedDistance;

  }

  scrollToBottom(): void {
    jQuery('html, body').animate({ scrollTop: jQuery(document).height() }, 3000);
  }


   setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
        //console.log('get currentPosition');

      });
    }else{
      // failed get Current Position
      this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
        data: 'Failed, get Current Position..'
      });

    }
  }

  private getMapCusotmStyles() {
    // Write your Google Map Custom Style Code Here.
  }

}

export class MapStorage {
  latitude: any;
  longitude: any;

}
