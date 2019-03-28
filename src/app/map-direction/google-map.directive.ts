
import { Directive,  Input, Output } from '@angular/core';
import {GoogleMapsAPIWrapper} from "@agm/core";

declare var google: any;

@Directive({
  selector: 'sebm-google-map-directions'
})
export class DirectionsMapDirective {

  @Input() origin;
  @Input() destination;
  @Input() waypoints:any;
  @Input() directionsDisplay:any;
  @Input() estimatedTime : any;
  @Input() estimatedDistance : any;

  constructor (private gmapsApi: GoogleMapsAPIWrapper) {}

  ngOnInit(){
    this.setMap();
  } 

  setMap(){

    this.gmapsApi.getNativeMap().then(map => {
      let directionsService = new google.maps.DirectionsService;
      let directionsDisplay = new google.maps.DirectionsRenderer;
      let me = this;
      directionsDisplay.setMap(map);
      directionsDisplay.setOptions({
        polylineOptions: {
          strokeWeight: 8,
          strokeOpacity: 0.7,
          strokeColor:  '#00468c'
        }
      });

      directionsService.route({
        origin: {lat: this.origin.latitude, lng: this.origin.longitude},
        destination: {lat: this.destination.latitude, lng: this.destination.longitude},
        waypoints: [],
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);

          let point = response.routes[ 0 ].legs[ 0 ];
          me.estimatedTime = point.duration.text ;
          me.estimatedDistance = point.distance.text;
          console.log(me.estimatedTime);
          console.log( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );

        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

    });
  }
}
