import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { User } from "../models";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { MatDialog, MatDialogConfig, MatPaginator, MatSort } from "@angular/material";
import { UserService } from "../services/user.service";
import { Observable } from "rxjs/Observable";
import { UserFormComponent } from "./user-form/user-form.component";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { DialogService } from "../services/dialog.service";
import { DialogExampleComponent } from "../dialogs/dialog-example/dialog-example.component";
import { Angular2Csv } from "angular2-csv";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { NgForm, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  editForm: FormGroup;


  //user detail properties 
  userName: string;
  detailEmail: string;
  branch: string;
  addr1: string;
  addr2: string;
  addr3: string;
  avatar: string;
  enable: boolean;
  userRole;
  selectedId: string; 

  itemCheck: checkItem[] = [];
  rolesArray: string[] = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_VIEW', 'ROLE_ADD', 'ROLE_EDIT', 'ROLE_DELETE', 'ROLE_GUEST', 'ROLE_VENDOR'];
  //selected id properties

  model: User = new User();
  subDeviceService: Subscription;


  color = 'warn';
  models: any;
  subUserService: Subscription;

  toolTipsPosition = "above";
  hasBackdrop = "false";

  displayedColumns = ['avatar', 'username', 'email', 'branch', 'enabled', 'roles', 'action1', 'action2', 'action3',];
  exampleDatabase = new ExampleDatabase(this.userService);
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('modalDelete') modalDelete: ElementRef;


  constructor(public dialog: MatDialog,
    private modalService: NgbModal,
    private router: Router,
    private dataService: DataService,
    private userService: UserService, 
    private ngxService: NgxUiLoaderService) { }


  ngOnInit() {

    this.ngxService.start();

    this.registerForm = new FormGroup({
      userName: new FormControl(),
      email: new FormControl(),
      branch: new FormControl(),
      address1: new FormControl(),
      address2: new FormControl(),
      address3: new FormControl(),
      enabled: new FormControl(),
      password: new FormControl(),
      file: new FormControl(''),
    
    });

    this.editForm = new FormGroup({
      userName: new FormControl(),
      email: new FormControl(),
      branch: new FormControl(),
      address1: new FormControl(),
      address2: new FormControl(),
      address3: new FormControl(),
      enabled: new FormControl(),
      password: new FormControl(),
      file: new FormControl(''),

    });

    this.tableData();
  }

  //form update section
  counter(i: number) {
    return new Array(i);
  }
  //form update section


  tableData() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
      this.ngxService.stop();
  }


  //section register

  registerButton(){
    this.model.id = null;
    this.model.address1 = "";
    this.model.address2 = "";
    this.model.address3 = "";
    this.model.avatar = "";
    this.model.name = "";
    this.model.password = "";
    this.model.username = "";
    this.model.email = "";
    this.model.branch = "";
  }

  updateEnable(enable, event) {

    if (event.checked == true) {
      console.log('updateEnable true');
      this.model.enabled = true;
    } else {
      console.log('updateEnable false');
      this.model.enabled = false;
    }
  }


  // get avatar and extra to string
  handleFileSelect(evt) {
    let files = evt.target.files;
    let file = files[0];
    let fileName = files[0].name;
    console.log(fileName);

    if (files && file) {
      let reader = new FileReader();

      reader.onload = this
        .handleReaderLoaded
        .bind(this);

      reader.readAsBinaryString(file);
    }

    $('.fileName').text(fileName);

  }

  handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.model.avatar = btoa(binaryString);
    // console.log(btoa(binaryString));
  }

  registerSubmit(value: NgForm) {
    // console.log("form value : ", value);
    console.log("model value : ", this.model);
    
    // this.router.navigate(['/account/register']);
    this.subDeviceService = this.userService.create(this.model)
      .subscribe((response: any) => {

        console.log('response ', response);
        $('#modalRegister').modal('hide');
        this.router.navigate(['/device-table'], { skipLocationChange: true }).then(() =>
        this.router.navigate(['/account']));

      }, error => {
        console.log('error ', error.message);
      });
  }

  // section register

  //section update

  getRole() {

      this.itemCheck = [];
      this.rolesArray.forEach(role => {
        console.log('role: ', role);
        let item: checkItem = new checkItem();
        item.name = role;
        this.itemCheck.push(item);
      });
      console.log("isi item: ",this.itemCheck);
      this.showRoles();

  }

  showRoles() {

    console.log('this.model.authorities', this.model.roles);
    for (let i = 0; i < this.model.roles.length; i++) {

      for (let x = 0; x < this.itemCheck.length; x++) {
        let name: any = this.model.roles[i];
        let namex: any = this.itemCheck[x].name;
        if (name === namex) {
          this.itemCheck[x].checkedOrUnchecked = true;
        }
      }
    }
    console.log('this.itemCheck', this.itemCheck);
  }

  updateRoles(role, event) {
    if (event.checked == true) {
      console.log('updateRoles true ', role);
      this.updateCheckBox(role);
    } else {
      console.log('removeCheckBox false ', role);
      this.removeCheckBox(role);
    }
  }

  updateCheckBox(item: checkItem) {
    console.log('updateCheckBox ', item);

    for (let x = 0; x < this.itemCheck.length; x++) {

      if (item.name === this.itemCheck[x].name) {
        this.itemCheck[x].checkedOrUnchecked = true;
      }
    }

    //console.log('this.itemCheck', this.itemCheck );

  }

  removeCheckBox(item: checkItem) {
    console.log('removeCheckBox ', item);
    for (let x = 0; x < this.itemCheck.length; x++) {

      if (item.name === this.itemCheck[x].name) {
        this.itemCheck[x].checkedOrUnchecked = false;
      }
    }

    //console.log('this.itemCheck', this.itemCheck );

  }

  setRoleModel() {
    this.model.roles = [];
    for (let i = 0; i < this.itemCheck.length; i++) {
      let item: checkItem = new checkItem();
      item = this.itemCheck[i];
      if (item.checkedOrUnchecked) {
        this.model.roles.push(item.name);
      }
    }
    console.log('setRoleModel ', this.model.roles);
  }


  onUpdate(value: NgForm) {
    // console.log(value);
    
    this.setRoleModel();
    console.log(this.model);
    this.subDeviceService = this.userService.update(this.model)
      .subscribe((response: any) => {

        console.log('response ', response);
        $('#modalEdit').modal('hide');
        this.router.navigate(['/device-table'], { skipLocationChange: true }).then(() =>
        this.router.navigate(['/account']));
      }, error => {
        console.log('error ', error.message);
        this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
          data: 'Update Failed..!! '
        });
      });

  }
  //section update 

  clearModel(){
    this.model.id = null;
    this.model.name = "";
    this.model.username = "";
    this.model.address1 = "";
    this.model.address2 = "";
    this.model.address3 = "";
    this.model.branch = "";
    this.model.password = "";
    this.model.avatar = "";
    this.model.email = "";
  }



  selectRow(row: any) {
    console.log('selectedRow', row);
    this.userName = row.username;
    this.detailEmail = row.email;
    this.branch = row.branch;
    this.addr1 = row.address1;
    this.addr2 = row.address2;
    this.addr3 = row.address3;
    this.avatar = row.avatar;
    this.enable = row.enabled;
    this.selectedId = row.id;
    this.userRole = row.roles;

    this.model.username = row.username;
    this.model.email = row.email;
    this.model.branch = row.branch;
    this.model.address1 = row.address1;
    this.model.address2 = row.address2;
    this.model.address3 = row.address3;
    // this.model.avatar = row.avatar;
    this.model.enabled = row.enabled;
    this.model.id = row.id;
    this.model.roles = row.roles;

    this.getRole();
  }

  viewUser(user: any) {

    this.dataService.setUserDs(user);
    console.log('viewUser ', user);
    // this.router.navigate(['/account/view-form', user.id]);
  }

  // addUser() {
  //   console.log('add new user');
  //   this.router.navigate(['/account/register']);
  // }

  // editUser(user: any) {
  //   this.dataService.setUserDs(user);
  //   console.log('edit user ', user);
  //   this.router.navigate(['/account/edit-form', user.id]);

  // }

  deleteUser(id: any) {
    console.log('delete user ', id);

    // $('#modalDelete').modal('hide');

    this.subUserService = this.userService.delete(id)
      .subscribe(data => {
        console.log(data.deleteStatus);
        if (data.deleteStatus) {
          this.router.navigate(['/device-table'], { skipLocationChange: true }).then(() =>
          this.router.navigate(['/account']));
          console.log("user deleted");
        } else {
          console.log("error");
        }
        $('#modalDelete').modal('hide');
        this.router.navigate(['/device-table'], { skipLocationChange: true }).then(() =>
        this.router.navigate(['/account']));
        // this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);

        // if(respons['deleteStatus']){
        //   console.log("data deleted");
        // }
      }, error => {
        $('#modalDelete').modal('hide');
        this.router.navigate(['/device-table'], { skipLocationChange: true }).then(() =>
        this.router.navigate(['/account']));
      }
      );

    // this.subUserService = this.userService.delete(user.id)
    //   .subscribe(() => {
    //     let indexValue = this.findIndexById(this.models, user);
    //     if (indexValue !== null) {
    //       //console.log('item remove',  items[i].username);

    //       this.models.splice(indexValue, 1);
    //     }

    //   }, error => {
    //     console.log('error ', error.message);
    //     this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
    //       data: 'Delete Failed..!! '
    //     });
    //   });
  }


  findIndexById(items: any[], item: any): number {

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {

        return i;
      }
    }
    return null;

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
    new Angular2Csv(this.models, 'User Table', options);
    //Angular2Csv(data, filename, options);
  }

  ngOnDestroy() {
    if (this.subUserService) {
      this.subUserService.unsubscribe();
    }

    if (this.subDeviceService) {
      this.subDeviceService.unsubscribe();
    }
  }


}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  get data(): User[] { return this.dataChange.value; }

  constructor(private userService: UserService) {
    // Fill up the database with 100 users.

    this.addUser();

    //for (let i = 0; i < 100; i++) { this.addUser(); }
  }

  /** Adds a new user to the database. */
  addUser() {

    this.userService.getAllUser()
      .subscribe(users => {
        console.log('account addUser ', users);
        for (let i = 0; i < users.length; i++) {
          let usr: User = users[i] as User;
          const copiedData = this.data.slice();
          copiedData.push(usr);
          this.dataChange.next(copiedData);
        }

      });
    // const copiedData = this.data.slice();
    // copiedData.push(this.createNewUser());
    // this.dataChange.next(copiedData);
  }


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

  filteredData: User[] = [];
  renderedData: User[] = [];

  constructor(private _exampleDatabase: ExampleDatabase,
    private _paginator: MatPaginator,
    private _sort: MatSort,
  ) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];



    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((item: User) => {
        let searchStr = (item.username).toLowerCase();
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
  sortData(data: User[]): User[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        //case 'userId': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'branch': [propertyA, propertyB] = [a.branch, b.branch]; break;
        case 'roles': [propertyA, propertyB] = [a.roles[0], b.roles[0]]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}


class role {
  name: string;
}

class checkItem {
  name: string;
  checkedOrUnchecked?: boolean = false
}
