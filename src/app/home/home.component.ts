import {Component, OnDestroy, OnInit, PlatformRef} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {PlatformLocation} from "@angular/common";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {User} from "../models";
import {DeviceService} from "../services/device.service";

import * as L from 'leaflet'
import {Icon} from "leaflet";
import {SearchData} from "../models/searchdata";
import {Device} from "../models/device";
import { Chart } from 'chart.js';

import { NgxChartsModule} from '@swimlane/ngx-charts';
import {DataService} from "../services/data.service";

declare var google:any;
declare var jQuery:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  chart = []; // This will hold our chart info

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartColors:Array<any> = [{
    backgroundColor: ['red',
                      'green',
                      'orange',
                      'yellow',
                      'pink']
  }];

  public barChartLabels:string[] = ['Offline',
                                    'Kertas',
                                    'Uang',
                                    'status4',
                                    'status5'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {
      data: [65, 59, 80, 81, 56],
      label: 'Series A'
    }
  ];



  view: any[] = [460, 180];
  ordersByStatusData : any[] = [];
  ordersByCountryData: any[] = [];
  colorScheme = {
    domain: ['#007cbb', '#61c673', '#ff8e28', '#ef2e2e']
  };
  barColorScheme = {
    domain: ['#007cbb']
  };

  /// PIE CHART
  // Pie
  public pieChartLabels:string[] = ['Offline',
    'Kertas',
    'Uang',
    'status4',
    'status5'];
  public pieChartData:number[] = [65, 59, 80, 81, 56];
  public pieChartType:string = 'pie';


  status: string[] = [];

  statusArray: string[] = [
    'dvsts1',
    'dvsts2',
    'dvsts3',
    'dvsts4',
    'dvsts5'
  ];


  blueIcon: L.Icon = new Icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/images/marker-icon.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });

  redIcon: L.Icon = new Icon({
    iconSize: [ 25, 41],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/icon/red-map.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });

  brownIcon: L.Icon = new Icon({
    iconSize: [ 25, 41],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/icon/brown-map.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });

  greenIcon: L.Icon = new Icon({
    iconSize: [ 25, 41],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/icon/green-map.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });

  pinkIcon: L.Icon = new Icon({
    iconSize: [ 25, 41],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/icon/merah_muda-map.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });

  yellowIcon: L.Icon = new Icon({
    iconSize: [ 25, 41],
    iconAnchor: [ 13, 41 ],
    iconUrl: '../../assets/icon/yellow-map.png',
    shadowUrl: '../../assets/images/marker-shadow.png'
  });

  // redIcon: L.Icon = new Icon({
  //   iconSize: [ 25, 41],
  //   iconAnchor: [ 13, 41 ],
  //   iconUrl: '../../assets/images/2027760.gif',
  //   shadowUrl: '../../assets/images/marker-shadow.png'
  // });

  // Open Street Map and Open Cycle Map definitions
  LAYER_OCM = {
    id: 'opencyclemap',
    name: 'Open Street Map',
    enabled: true,
    layer: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWRkeTJlbmFtIiwiYSI6ImNqZGI5ZGw1bjUzeXkyd3M2d2owMDJmeXAifQ.2694zHwfWLWCOCRSpB7xUw', {
      maxZoom: 16,
      attribution: 'Open Street  Map'
    })
  };
  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: false,
    layer: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWRkeTJlbmFtIiwiYSI6ImNqZGI5ZGw1bjUzeXkyd3M2d2owMDJmeXAifQ.2694zHwfWLWCOCRSpB7xUw', {
      maxZoom: 16,
      attribution: 'Open Street Map'
    })
  };

  // Values to bind to Leaflet Directive
  layersControlOptions = { position: 'topright' };
  baseLayers = {
    'Open Street MapBox': this.LAYER_OSM.layer,
    'Open Street Leaflet': this.LAYER_OCM.layer
  };
  options = {
    zoom: 9,
    center: L.latLng([-6.9666667, 110.4166667])
  };

  fitBounds: L.LatLngBounds;
  markers: L.Layer[] = [];

  layers: L.Layer[] = this.markers;

  //lat: number = -6.981529;
  //lng: number = 110.413563;
  zoom:number = 9;
  shadowUrl: string = '../../assets/images/marker-shadow.png';
  icon1: string = '../../assets/icon/green-map.png';
  icon2: string = '../../assets/icon/blue-map.png';
  icon3: string = '../../assets/icon/brown-map.png';
  icon4: string = '../../assets/icon/pink-map.png';
  icon5: string = '../../assets/icon/red-map.png';

  map_url: string = '';
  subDevices: Subscription;
  subUser: Subscription;
  latlngBounds: any;

  branch: any;

  datas: marker[] = [];

  currentUser: User = new User;

  public latitude: number;
  public longitude: number;

  imgUrl: string = '';
  dirUrl: string = '';
  animateIcon: string = '';

  constructor(private router: Router,
              private userService: UserService,
              private location: PlatformLocation,
              private deviceService: DeviceService,
              private dataService: DataService,
              private auth: AuthService) {

    this.location.onPopState(() => {
      //alert(window.location);
      //this.userService.logout();

      this.router.navigate(['/home']);

    });


    this.refresh();
    //this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //this. getModels();
  }

  ngOnInit() {
    this.refresh();
    //this. getModels();
    //this.setCurrentPosition();
    var me = this;

  }

  // events
  public chartClicked(e:any):void {
    console.log("index #", e.active[0]._index);
    console.log("label #", e.active[0]._model.label);
    let label = e.active[0]._model.label;
    let index = e.active[0]._index;
    let sts = this.statusArray[index];

    this.router.navigate(['/device-table/device-by-status/'+ sts]);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public chartPieClicked(e:any):void {
    console.log("index #", e.active[0]._index);
    let index = e.active[0]._index;
    let x =  e.active[0]._index;
    let sts = this.statusArray[index];

    console.log("label #", this.pieChartLabels[x]);
    let label = this.pieChartLabels[x];
    this.router.navigate(['/device-table/device-by-status/'+ sts]);
  }

  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }


  refresh(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this. getModels();
    this.setCurrentPosition();
  }


  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;

        //console.log('this.latitude ', this.latitude);
        //console.log('this.longitude ', this.longitude);

        let data = localStorage.getItem('start');
        if(data !== null){
          localStorage.removeItem("start");
        }

        let map: MapStorage = new MapStorage();
        map.latitude = position.coords.latitude;
        map.longitude = position.coords.longitude;
        localStorage.setItem("start", JSON.stringify(map));


      });
    }
  }


  getModels() {

    //this.imgUrl = '../../assets/images/green_pin.png';
    this.imgUrl = '../../assets/images/marker-icon.png';
    //this.imgUrl = '../../assets/images/pin_blinking.gif';

    this.dirUrl = '../../assets/images/geo_fence.png';

    this.animateIcon = '../../assets/images/r_map_c.png';

    let user: User = JSON.parse(localStorage.getItem('currentUser'));
    console.log('user ', user);

    if (this.auth.getAdmin() || this.auth.getGuest()) {
      this.getDevices();
    }else{

      this.getDevicesByBranch(user.branch);
    }

  }

  getDevices(){

    this.subDevices = this.deviceService.getAllDevices()
      .subscribe(resp => {
        console.log("getDevices ", resp);

        this.getMarker(resp);
      }, error => {
        console.log('error ', error.message);
      })

  }

  getDevicesByBranch(branch: string){

    let search: SearchData = new SearchData();
    search.searchKey = branch;
    this.subDevices = this.deviceService.getDeviceByBranch(search)
      .subscribe(resp => {
        console.log("getDevicesByBranch ", resp);

        this.getMarker(resp);
      }, error => {
        console.log('error ', error.message);
      })
  }



  getMarker(devices: Device[]){

    console.log('device size', devices.length);
    for (let i = 0; i <devices.length; i++) {
      // let device: Device = new Device();
      //device = res[i] as Device;

      let bounds = L.latLngBounds([]);

      let data: any;

      let device = JSON.parse(JSON.stringify(devices[i]));
      //console.log('device ', device);

      //console.log('dvloc3 ', device.dvloc3);
      //let address = device.dvloc3;

      if (device.latitude !== null && device.longitude !== null) {


        let lat = device.latitude.replace(/[()]/g, '');
        let lng = device.longitude.replace(/[()]/g, '');


        if(device.report !== null){
              data = L.marker(
                [lat, lng], {icon: this.redIcon}
              );
              // marker.bindPopup(this.data[i].name);
              data.bindPopup("<strong>" + device.dvloc1 + "</strong>" +
                "<br>" + device.dvloc2 + "<br>" + device.dvloc3 + "<br>" +
                "<strong>" + device.dvsts1 + "</strong>" );
        } else {
          data = L.marker(
            [lat, lng],{ icon: this.blueIcon }

          );
          data.bindPopup("<strong>" + device.dvloc1 + "</strong>" +
            "<br>" + device.dvloc2 + "<br>" +  device.dvloc3 , {
            showOnMouseOver: true
          });
        }


        this.markers.push(data);

      }
    }
  }


  ngOnDestroy(){

    if(this.subDevices !== null){
      this.subDevices.unsubscribe();
    }
  }



}//

// just an interface for type safety.
export class marker {
  lat: number;
  lng: number;
  icon: string;
  label?: string;
  report?: string;
}

export class MapStorage {
  latitude: any;
  longitude: any;

}


