import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';

import * as L from 'leaflet'
import {Icon} from "leaflet";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{


  title = 'app';

  blueIcon: L.Icon = new Icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/images/marker-icon.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });

  redIcon: L.Icon = new Icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/images/map-red-icon.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });



//http://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png
  //'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  options = {
    layers: [
      L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmlja3IiLCJhIjoiY2l2aW9lcXlvMDFqdTJvbGI2eXUwc2VjYSJ9.trTzsdDXD2lMJpTfCVsVuA',
        { attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18
        })
    ],
    zoom: 2,
    center: L.latLng([20.0, 5.0])
  };


  markers: L.Layer[] = [];

  layers: L.Layer[] = this.markers;


  data = [
    {
      "name": "Canada",
      "url": "https://en.wikipedia.org/wiki/Canada",
      "lat": 56.130366,
      "lng": -106.346771
    },
    {
      "name": "Anguilla",
      "url": "https://en.wikipedia.org/wiki/Anguilla",
      "lat": 18.220554,
      "lng": -63.068615
    },
    {
      "name": "Barbados",
      "url": "https://en.wikipedia.org/wiki/Barbados",
      "lat": 13.193887,
      "lng": -59.543198
    },
    {
      "name": "United States",
      "url": "https://en.wikipedia.org/wiki/United_States",
      "lat": 37.090240,
      "lng": -95.712891
    },
    {
      "name": "Ireland",
      "url": "https://en.wikipedia.org/wiki/Ireland",
      "lat": 53.412910,
      "lng": -8.243890
    },
    {
      "name": "Scotland",
      "url": "https://en.wikipedia.org/wiki/Scotland",
      "lat": 56.490671,
      "lng": -4.202646
    },
    {
      "name": "England",
      "url": "https://en.wikipedia.org/wiki/England",
      "lat": 52.355518,
      "lng": -1.174320
    },
    {
      "name": "France",
      "url": "https://en.wikipedia.org/wiki/France",
      "lat": 46.227638,
      "lng": 2.213749
    },
    {
      "name": "The Netherlands",
      "url": "https://en.wikipedia.org/wiki/The_Netherlands",
      "lat": 52.132633,
      "lng": 5.291266
    },
    {
      "name": "Switzerland",
      "url": "https://en.wikipedia.org/wiki/Switzerland",
      "lat": 46.818188,
      "lng": 8.227512
    },
    {
      "name": "South Africa",
      "url": "https://en.wikipedia.org/wiki/South_Africa",
      "lat": -30.559482,
      "lng": 22.937506
    },
    {
      "name": "Madagascar",
      "url": "https://en.wikipedia.org/wiki/Madagascar",
      "lat": -18.766947,
      "lng": 46.869107
    },
    {
      "name": "Taiwan",
      "url": "https://en.wikipedia.org/wiki/Taiwan",
      "lat": 23.697810,
      "lng": 120.960515
    },
    {
      "name": "Japan",
      "url": "https://en.wikipedia.org/wiki/Japan",
      "lat": 36.204824,
      "lng": 138.252924
    }
  ];


  constructor(){

  }

  ngOnInit(): void {

    this.getMarkers();

    this.setCurrentPosition();
  }


  getMarkers(){

    for ( let i=0; i < this.data.length; ++i )
    {

      let marker = L.marker(
        [this.data[i].lat, this.data[i].lng],{ icon: this.blueIcon }

      );
      //marker bounce

      // marker.bindPopup(this.data[i].name);
      marker.bindPopup("<h1>" + this.data[i].name +
        "</h1><p>" +
        '<a href="' + this.data[i].url + '" target="_blank">' +
        this.data[i].url +
        '</a>' + "</p>" +

        "<input type='button' value='Delete this marker' class='marker-delete-button'/>");
      this.markers.push(marker);
    }
  }


  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        console.log('this.latitude ', position.coords.latitude);
        console.log('this.longitude ', position.coords.longitude);

      });
    }
  }

  goDirection(){

    console.log('showMore() => click');
  }


}
