import {AfterViewInit, Component, OnInit} from '@angular/core';
import { WeatherService } from './weather.service';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {

  chart = []; // This will hold our chart info

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartColors:Array<any> = [{
    backgroundColor: ['red', 'yellow', 'green', 'orange', 'pink']
  }];

  public barChartLabels:string[] = ['status1', 'status2', 'status3', 'status4', 'status5'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {
      data: [65, 59, 80, 81, 56],
      label: 'Series A'
    }
  ];


  constructor(private _weather: WeatherService) {}

  ngOnInit() {


  }

  // events
  public chartClicked(e:any):void {
    console.log("index #", e.active[0]._index);
    console.log("label #", e.active[0]._model.label);
  }

  public chartHovered(e:any):void {
    console.log(e);
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

  ngAfterViewInit() {

  }



}
