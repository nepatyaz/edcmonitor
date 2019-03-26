import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DeviceService} from "../../services/device.service";
import {DataService} from "../../services/data.service";
import { Observable } from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {User} from "../../models";
import {MatDialog, MatPaginator, MatSort} from "@angular/material";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {Device} from "../../models/device";
import {Angular2Csv} from "angular2-csv";
import {BehaviorSubject} from "rxjs/BehaviorSubject";


@Component({
  selector: 'app-table-by-status',
  templateUrl: './table-by-status.component.html',
  styleUrls: ['./table-by-status.component.scss']
})
export class TableByStatusComponent implements OnInit {

  color = 'warn';
  models: any;
  subUserService: Subscription;
  params: string = '';
  currentUser: User = new User();
  subDeviceService: Subscription;

  displayedColumns = ['avatar', 'id', 'branch', 'dvloc1', 'report', 'action1'];
  exampleDatabase = new ExampleDatabase(this.deviceService);
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private auth: AuthService,
              private userService: UserService,
              private dataService: DataService,
              private deviceService: DeviceService) { }

  ngOnInit() {

    this.dataService.setParamDs(this.route.snapshot.params['status']);
    this.params = this.route.snapshot.params['status'];
    console.log('onInit TableByStatusComponent ', this.params);

      //this.getStatus();

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }//

  getStatus(){

  this.deviceService.getDeviceStatus()
    .subscribe(resp => {
      console.log('getDeviceStatus ', resp);
    }, error => {
      console.log('error ', error.message);
    })
  }


  selectRow(row: any) {
    console.log('selectedRow' ,row);
  }

  viewDevice(data:any){
    this.dataService.setDeviceDs(data);
    this.router.navigate(['device-table/view-device', data.id]);
  }

  addDevice(){
    console.log('add new device');
    this.router.navigate(['device-table/add-device']);

  }

  editDevice(data:any){
    this.dataService.setDeviceDs(data);
    this.router.navigate(['device-table/edit-device', data.id]);
    console.log('edit device ', data);

  }

  deleteDevice(data: any){
    console.log('delete device ', data);
    this.subDeviceService = this.deviceService.delete(data.id)
      .subscribe(() => {
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

  ngOnDestroy(){
    if(this.subDeviceService) {
      this.subDeviceService.unsubscribe();
    }
  }

  //export to CSV
  exportCSV(){

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

  getDevicesByBranch(){

    this.deviceService.getDeviceStatus()
      .subscribe(devices => {
        console.log("getByBranch ", devices);
        for(let i=0; i<devices.length; i++){
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

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: Device[]): Device[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

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

