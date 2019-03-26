import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  registerForm: FormGroup;

  //user detail properties 
  userName: string;
  detailEmail: string;
  branch: string;
  addr1: string;
  addr2: string;
  addr3: string;
  avatar: string;
  enable: boolean;
  role: string;
  selectedId: string;

  roles: string[] = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_VIEW', 'ROLE_ADD', 'ROLE_EDIT', 'ROLE_DELETE', 'ROLE_GUEST', 'ROLE_VENDOR'];

  model: User = new User();
  //selected id properties



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
    private userService: UserService, ) { }


  ngOnInit() {


    this.registerForm = new FormGroup({
      userName: new FormControl(),
      email: new FormControl(),
      branch: new FormControl(),
      address1: new FormControl(),
      address2: new FormControl(),
      address3: new FormControl(),
      enabled: new FormControl(),
      password: new FormControl(),

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
  }


  //section register

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

  // section register


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
    console.log("Boolean Value : ", this.enable);
    this.role = row.roles;

  }

  viewUser(user: any) {

    this.dataService.setUserDs(user);
    console.log('viewUser ', user);
    // this.router.navigate(['/account/view-form', user.id]);
  }

  addUser() {
    console.log('add new user');
    this.router.navigate(['/account/register']);
  }

  editUser(user: any) {
    this.dataService.setUserDs(user);
    console.log('edit user ', user);
    this.router.navigate(['/account/edit-form', user.id]);
  }

  deleteUser(id: any) {
    console.log('delete user ', id);

    // $('#modalDelete').modal('hide');

    this.subUserService = this.userService.delete(id)
      .subscribe(data => {
        console.log(data.deleteStatus);
        if (data.deleteStatus) {
          console.log("user deleted");
        } else {
          console.log("error");
        }
        $('#modalDelete').modal('hide');

        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);

        // if(respons['deleteStatus']){
        //   console.log("data deleted");
        // }
      }, error => {
        console.log(error);
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


  registerSubmit(value: NgForm) {
    console.log(value);
    console.log("register submit jalan");
  }

  test() {
    console.log("Ok");
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



