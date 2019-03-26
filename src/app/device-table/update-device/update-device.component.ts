import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {Device} from "../../models/device";
import {User} from "../../models";
import {DeviceService} from "../../services/device.service";
import {AuthService} from "../../services/auth.service";



@Component({
  selector: 'app-update-device',
  templateUrl: './update-device.component.html',
  styleUrls: ['./update-device.component.scss']
})
export class UpdateDeviceComponent implements OnInit {


  reports = [
    "Printer error",
    "Keyboard error",
    "Screen error",
    "Charger error",
    "Tidak bisa baca kartu",
    "General Error"
  ];

  model: Device = new Device();
  edc: Device = new Device();

  errorMessage: string;
  title: string = "Report EDC";
  action: string = "Create";
  public selectedModel: any;

  isEdit:boolean = false;

  currentUser: User = new User;


  constructor(
              private deviceService: DeviceService,
              private auth: AuthService,
              public router: Router,
              public dialog: MatDialogRef<UpdateDeviceComponent>,
              ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
   // console.log('this.currentUser userId', this.currentUser.id);
  }

  ngOnInit() {
    if (this.selectedModel) {
      this.model = this.selectedModel;
      this.title = "Report EDC";
      this.action = "Report";
      this.isEdit = true;
    }


    //console.log('userId ', this.userService.getCurrent());
  }

  getReport(data){

    console.log('pick report ', data);

    this.model.report = data;
    // this.deviceService.update(this.model)
    //     .subscribe((response: any) => {
    //       this.selectedModel = null;
    //       this.model = response;
    //       this.dialog.close(this.model);
    //
    //     });
  }




}//end

