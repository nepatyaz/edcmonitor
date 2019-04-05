import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from "@angular/material";
import { DeviceService } from "../../services/device.service";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthService } from "../../services/auth.service";
import { SearchData } from "../../models/searchdata";
import { Device } from "../../models/device";
import { User } from "../../models";
import * as $ from 'jquery';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

declare var $: any;
@Component({
  selector: 'app-admin-device',
  templateUrl: './admin-device.component.html',
  styleUrls: ['./admin-device.component.scss']
})
export class AdminDeviceComponent implements OnInit, OnDestroy {

  addForm: FormGroup;
  subDeviceService: Subscription;


  viewBranch: string = "";
  color = 'warn';
  models: any;
  subUserService: Subscription;

  displayedColumns = ['avatar', 'id', 'branch', 'dvloc1', 'dvloc2', 'dvloc3', 'action1'];
  exampleDatabase = new ExampleDatabase(this.deviceService);
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;

  //model
  model: Device = new Device();


  //tooltips
  toolTipsPosition = "above";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(public dialog: MatDialog,
    private router: Router,
    public auth: AuthService,
    private ngxService: NgxUiLoaderService,
    private deviceService: DeviceService) {

  }


  ngOnInit() {
    this.ngxService.start();

    this.addForm = new FormGroup({
      dvdvid: new FormControl(null, Validators.required),
      dvbrch: new FormControl(null, Validators.required),
      dvdown: new FormControl(),
      dvdrch: new FormControl(),
      dvloc1: new FormControl(),
      dvloc2: new FormControl(),
      dvloc3: new FormControl(),
      dvserl: new FormControl(),
      dvmake: new FormControl(''),
      dvmodl: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    });

    this.tableData();

  }

  get inputdvbrch() { return this.addForm.get('dvbrch'); }
  get inputdvdvid() { return this.addForm.get('dvdvid'); }

  tableData() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //   .debounceTime(150)
    //   .distinctUntilChanged()
    //   .subscribe(() => {
    //     if (!this.dataSource) { return; }
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   });
    this.ngxService.stop();
  }

  selectRow(row: any) {
    console.log('selectedRow', row);
  }

  viewUser(selectedItem: any) {
    this.viewBranch = selectedItem.dvbrch;
    let branch = JSON.parse(JSON.stringify(selectedItem.dvbrch));
    console.log('this.viewBranch ', this.viewBranch);
    this.deviceService.setParam(this.viewBranch);
    this.router.navigate(['device-table/user-device', this.viewBranch]);
  }

  // addUser() {
  //   console.log('add new device');
  //   // this.router.navigate(['/account/register']);
  // }

  // editUser(data: any) {

  //   // localStorage.removeItem('edituser');
  //   // localStorage.setItem('edituser', JSON.stringify(user));
  //   //this.dataService.userDataService = user;

  //   console.log('edit device ', data);
  //   // this.router.navigate(['/account/edit-form']);
  // }

  // deleteUser(data: any) {
  //   console.log('delete device ', data);
  //   // this.subDeviceService = this.userService.delete(user.id)
  //   //   .subscribe(() => {
  //   //     let indexValue = this.findIndexById(this.models, user);
  //   //     if (indexValue !== null) {
  //   //       //console.log('item remove',  items[i].username);
  //   //
  //   //       this.models.splice(indexValue, 1);
  //   //     }
  //   //
  //   //   });
  // }

  // addDevice() {
  //   console.log('add new device');
  //   this.router.navigate(['device-table/add-device']);

  // }


  findIndexById(items: any[], item: any): number {

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {

        return i;
      }
    }
    return null;

  }

  addFormSubmit(value: NgForm) {

    console.log("Form value : ", value);
    console.log("model value : ", this.model);

    this.subDeviceService = this.deviceService.create(this.model)
      .subscribe((response: any) => {

        console.log('response ', response);
        $('#modalAddDevice').modal('hide');
        setTimeout(() => {
          this.router.navigateByUrl('/device-table', { skipLocationChange: true }).then(() => {
            this.deviceService.setParam(this.model.dvbrch);
            this.router.navigate(['device-table/user-device', this.model.dvbrch])
          });
        }, 1200);


        // this.router.navigate(['device-table/user-device', this.model.dvbrch]);


      }, error => {
        console.log('error ', error.message);
        // this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
        //   data: 'Add Device Failed..!! '
        // });
      });


  }

  ngOnDestroy() {
    if (this.subDeviceService) {
      this.subDeviceService.unsubscribe();
    }
  }


}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Device[]> = new BehaviorSubject<Device[]>([]);
  get data(): Device[] { return this.dataChange.value; }

  constructor(private deviceService: DeviceService) {
    // Fill up the database with 100 users.

    let user = JSON.parse(localStorage.getItem('currentUser'));

    for (let i = 0; i < user.roles.length; i++) {
      if (user.roles[i] === 'ROLE_ADMIN' || user.roles[i] === 'ROLE_GUEST') {
        this.getUserDeviceByDvbrch();
      } else {
        this.getDevicesByBranch(user.branch);
      }
    }
  }

  getUserDeviceByDvbrch() {

    this.deviceService.getDeviceUserByDvbrch()
      .subscribe(devices => {
        console.log("getUserDeviceByDvbrch ", devices);
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

  getDevices() {

    this.deviceService.getAllDevices()
      .subscribe(devices => {
        console.log("getDevices ", devices);

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

  remove_duplicates(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    arr = [];
    for (let key in obj) {
      arr.push(key);
    }
    return arr;
  }

  getDevicesByBranch(branch: string) {

    let search: SearchData = new SearchData();
    search.searchKey = branch;
    this.deviceService.getDeviceByBranch(search)
      .subscribe(devices => {
        console.log("getDevicesByBranch ", devices);
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
        let searchStr = (item.dvbrch);
        //let searchStr = (item.dvloc1 + item.dvloc2 + item.dvloc3).toLowerCase();
        return searchStr;
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
        case 'dvloc2': [propertyA, propertyB] = [a.dvloc2, b.dvloc2]; break;
        case 'dvloc3': [propertyA, propertyB] = [a.dvloc3, b.dvloc3]; break;
      }
      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}



