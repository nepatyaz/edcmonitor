import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort } from "@angular/material";
import { DeviceService } from "../../services/device.service";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthService } from "../../services/auth.service";
import { SearchData } from "../../models/searchdata";
import { Device } from "../../models/device";
import { UserService } from "../../services/user.service";
import { User } from "../../models";
import { DataService } from "../../services/data.service";
import { Angular2Csv } from "angular2-csv";
import { UpdateDeviceComponent } from "../update-device/update-device.component";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-device',
  templateUrl: './user-device.component.html',
  styleUrls: ['./user-device.component.scss']
})
export class UserDeviceComponent implements OnInit, OnDestroy {

  //form properties
  formEditUser: FormGroup;

  //device properties
  id: string;
  dvdvid: string;
  dvbrch: string;
  dvdown: string;
  dvdrch: string;
  dvloc1: string;
  dvloc2: string;
  dvloc3: string;
  dvserl: string;
  dvmake: string;
  dvmodl: string;
  latitude: string;
  longitude: string;

  //tooltips position 
  toolTipsPosition = "above";


  roleEdit: boolean = false;
  color = 'warn';
  models: any;
  subUserService: Subscription;
  params: string = '';
  currentUser: User = new User();
  subDeviceService: Subscription;

  displayedColumns = ['avatar', 'id', 'branch', 'dvloc1', 'report', 'action1', 'action2', 'action3', 'action4', 'action5'];
  exampleDatabase = new ExampleDatabase(this.deviceService);
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;


  constructor(public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    private userService: UserService,
    private dataService: DataService,
    private deviceService: DeviceService,
    private formBuilder: FormBuilder) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // for (let i=0; i<this.currentUser.roles.length; i++ ){
    //   let role:string = this.currentUser.roles[i];
    //   if(role === "ROLE_EDIT"){
    //     this.roleEdit = true;
    //   }
    // }


  }


  ngOnInit() {

    this.formEditUser = this.formBuilder.group({
      'dvdvid': [null],
      'dvbrch': [null],
    });

    // this.formEditUser = new FormGroup(
    //   {
    //     // dvdvid: ['', Validators.required],
    //     // dvbrch: ['', Validators.required]
    //     dvdvid: new FormControl(''),
    //     dvbrch: new FormControl(''),
    //   }
    // );

    this.params = this.route.snapshot.params['id'];
    console.log('onInit params ', this.params);
    if (this.params !== undefined) {
      this.params = this.currentUser.branch;
    }

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  onSubmit() {
    let formValue = this.formEditUser.value;
    console.warn(this.formEditUser.value);
    console.log("valuenya ");
    console.log(formValue);
  }


  goDirection(event) {

    console.log('goDirection ', event);

    let data = localStorage.getItem('finish');
    if (data !== null) {
      localStorage.removeItem("finish");
    }

    let map: MapStorage = new MapStorage();
    map.latitude = event.dvlat;
    map.longitude = event.dvlon;
    localStorage.setItem("finish", JSON.stringify(map));

    this.router.navigate(['/maps']);
  }

  selectRow(row: any) {
    console.log('selectedRow', row);
    this.id = row.id;
    this.dvdvid = row.dvdvid
    this.dvbrch = row.dvbrch
    this.dvdown = row.dvdown
    this.dvdrch = row.dvdrch
    this.dvloc1 = row.dvloc1
    this.dvloc2 = row.dvloc2
    this.dvloc3 = row.dvloc3
    this.dvserl = row.dvserl
    this.dvmake = row.dvmake
    this.dvmodl = row.dvmodl
    this.latitude = row.latitude
    this.longitude = row.longitude
  }

  viewDevice(data: any) {
    this.dataService.setDeviceDs(data);
    this.router.navigate(['device-table/view-device', data.id]);
  }

  reportDevice(data: any) {
    this.dataService.setDeviceDs(data);
  }

  reportEdc(selectedItems: any) {

    let config: MatDialogConfig = <MatDialogConfig>{ width: '500px' };
    let dialogRef = this.dialog.open(UpdateDeviceComponent, config);

    console.log('selectedRow', selectedItems);
    dialogRef.componentInstance.selectedModel = JSON.parse(JSON.stringify(selectedItems[0]));

    dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (response) {
          let indexKeyValue = this.findIndexById(this.models, response);
          if (indexKeyValue !== null) {
            this.models[indexKeyValue] = response;
          }

        }
      });

  }


  addDevice() {
    console.log('add new device');
    this.router.navigate(['device-table/add-device']);

  }

  editDevice(data: any) {
    this.dataService.setDeviceDs(data);
    this.router.navigate(['device-table/edit-device', data.id]);
    console.log('edit device ', data);

  }

  deleteDevice(data: any) {
    console.log('delete device ', data);
    this.subDeviceService = this.deviceService.delete(data)
      .subscribe((respon) => {
        let indexValue = this.findIndexById(this.models, data);
        if (indexValue !== null) {
          //console.log('item remove',  items[i].username);

          this.models.splice(indexValue, 1);
        }

      });
  }




  findIndexById(items: any[], item: any): number {

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {

        return i;
      }
    }
    return null;

  }

  ngOnDestroy() {
    if (this.subDeviceService) {
      this.subDeviceService.unsubscribe();
    }
  }

  //export to CSV
  exportCSV() {

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true
    };
    new Angular2Csv(this.models, 'Device Table', options);
    //Angular2Csv(data, filename, options);
  }


}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Device[]> = new BehaviorSubject<Device[]>([]);

  get data(): Device[] { return this.dataChange.value; }

  constructor(private deviceService: DeviceService) {
    // Fill up the database with 100 users.

    this.getDevicesByBranch();
  }

  getDevicesByBranch() {

    this.deviceService.getByBranch()
      .subscribe(devices => {
        console.log("getByBranch ", devices);
        for (let i = 0; i < devices.length; i++) {
          let dev: Device = devices[i] as Device;
          const copiedData = this.data.slice();
          copiedData.push(dev);
          this.dataChange.next(copiedData);
        }


      }, error => {
        console.log('error ', error.message);
      })
  }

  /** Adds a new user to the database. */
  // addDevice() {
  //
  //   this.deviceService.getAllDevices()
  //     .subscribe(users => {
  //       console.log('account addUser ', users);
  //       for(let i=0; i<users.length; i++){
  //         let usr: User = users[i] as User;
  //         const copiedData = this.data.slice();
  //         copiedData.push(usr);
  //         this.dataChange.next(copiedData);
  //       }
  //
  //     });
  //   // const copiedData = this.data.slice();
  //   // copiedData.push(this.createNewUser());
  //   // this.dataChange.next(copiedData);
  // }


}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: Device[] = [];
  renderedData: Device[] = [];

  constructor(private _exampleDatabase: ExampleDatabase,
    private _paginator: MatPaginator,
    private _sort: MatSort,
  ) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Device[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];



    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((item: Device) => {
        let searchStr = (item.dvbrch).toLowerCase();
        //let searchStr = (item.name + item.color).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  sortData(data: Device[]): Device[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        //case 'userId': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'id': [propertyA, propertyB] = [a.dvdvid, b.dvdvid]; break;
        case 'branch': [propertyA, propertyB] = [a.dvbrch, b.dvbrch]; break;
        case 'dvloc1': [propertyA, propertyB] = [a.dvloc1, b.dvloc1]; break;
        case 'report': [propertyA, propertyB] = [a.report, b.report]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}



export class MapStorage {
  latitude: any;
  longitude: any;

}

