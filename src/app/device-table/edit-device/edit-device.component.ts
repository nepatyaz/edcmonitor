import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import {DeviceService} from "../../services/device.service";
import {DialogExampleComponent} from "../../dialogs/dialog-example/dialog-example.component";
import {Router} from "@angular/router";
import {Device} from "../../models/device";
import {Subscription} from "rxjs/Subscription";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit, OnDestroy {

  color = 'warn';
  colorCheck = 'primary';
  model: Device = new Device();

  subDeviceService: Subscription;

  constructor(private router: Router,
              private dialog: MatDialog,
              private dataService: DataService,
              private deviceService: DeviceService) {}

  ngOnInit() {

    this.model = this.dataService.getDeviceDs();
  }

  onCancel(){
    this.router.navigate(['/device-table']);
  }



  onSubmit() {
    console.log('device add-model ', this.model);

    this.subDeviceService = this.deviceService.update(this.model)
      .subscribe((response: any) => {

        console.log('response ', response);
        this.router.navigate(['/device-table']);

      }, error => {
        console.log('error ', error.message);
        this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
          data: 'Register Failed..!! '
        });
      });

  }

  // get avatar and extra to string
  handleFileSelect(evt) {
    let files = evt.target.files;
    let file = files[0];

    if (files && file) {
      let reader = new FileReader();

      reader.onload = this
        .handleReaderLoaded
        .bind(this);

      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.model.avatar = btoa(binaryString);
    console.log(btoa(binaryString));
  }

  ngOnDestroy(){
    if(this.subDeviceService) {
      this.subDeviceService.unsubscribe();
    }
  }

}
