import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {Device} from "../../models/device";
import {DeviceService} from "../../services/device.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {DialogExampleComponent} from "../../dialogs/dialog-example/dialog-example.component";


@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit, OnDestroy {

  color = 'warn';
  colorCheck = 'primary';
  model: Device = new Device();


  subDeviceService: Subscription;



  constructor(private router: Router,
              private dialog: MatDialog,
              private deviceService: DeviceService) {}

  ngOnInit() {

  }

  onCancel(){
    this.router.navigate(['/device-table']);
  }



  onSubmit() {
    console.log('device add-model ', this.model);

    this.subDeviceService = this.deviceService.create(this.model)
      .subscribe((response: any) => {

        console.log('response ', response);
        this.router.navigate(['/device-table']);

      }, error => {
        console.log('error ', error.message);
        this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
          data: 'Add Device Failed..!! '
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
