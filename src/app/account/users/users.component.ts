import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {User} from "../../models";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort} from "@angular/material";
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {UserFormComponent} from "../user-form/user-form.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  model: any;
  subUserService: Subscription;


  displayedColumns = ['username', 'email', 'roles', 'action1', 'action2'];
  exampleDatabase = new ExampleDatabase(this.userService);
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;


  constructor(public dialog: MatDialog,
              private userService: UserService) {}


  ngOnInit() {

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  selectRow(row: any) {
    console.log('selectedRow' ,row);
  }

  addUser(){
    console.log('add new user');
  }

  editUser(user:any){

    console.log('edit user ', user);
  }

  deleteUser(user: any){
    console.log('delete user ', user);
  }

  editItem(selectedItems: any) {

    let config: MatDialogConfig = <MatDialogConfig>{width: '600px'};
    let dialogRef = this.dialog.open(UserFormComponent, config);

    console.log('selectedItems ', selectedItems);

    //dialogRef.componentInstance.selectedModel = JSON.parse(JSON.stringify(selectedItems[0]));
    dialogRef.componentInstance.selectedModel = JSON.parse(JSON.stringify(selectedItems));


    this.subUserService = dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        let indexKeyValue = this.findIndexById(this.model, response);
        if (indexKeyValue !== null) {
          this.model[indexKeyValue] = response;
        }

      }
    });

  }

  findIndexById(items: any[], item: any): number {

    for (let i = 0; i < items.length; i++) {
      if (item.id == items[i].id) {
        return i;
      }
    }

    return null;
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }
  //
  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }

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
        for(let i=0; i<users.length; i++){
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

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: User[]): User[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        //case 'userId': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'roles': [propertyA, propertyB] = [a.roles[0], b.roles[0]]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}



