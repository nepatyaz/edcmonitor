import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../models";
import {Device} from "../../models/device";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-view-device',
  templateUrl: './view-device.component.html',
  styleUrls: ['./view-device.component.scss']
})
export class ViewDeviceComponent implements OnInit {

  model: Device = new Device();

  constructor(private router: Router,
              private dataService: DataService) { }

  ngOnInit() {
    this.model = this.dataService.getDeviceDs();
  }

  onCancel(){
    this.router.navigate(['/device-table']);
  }

}
