import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { User } from '../models';
import { DataService } from '../services/data.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
declare var $: any;
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { databaseFactory } from 'angular-async-local-storage/src/module';

export interface userInterface {
  id: string;
  address1: string;
  address2: string;
  address3: string;
  branch: string;
  email: string;
  enabled: string;
  name: string;
  username: string;
}

export interface rolesInterface {
  id: string;
  roles: string;
}


@Component({
  selector: 'app-tes',
  templateUrl: './tes.component.html',
  styleUrls: ['./tes.component.scss']
})
export class TesComponent implements OnInit {

  //Paginator 
  length;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('userNameInput') userNameInput: ElementRef;
  defaultPagination: any = { pageIndex: 0, pageSize: 10, length: 16 };


  //username input register 
  isRegistered: boolean = false;
  public userNameInputValue: string = "";

  //subscriptioion properties
  subDeviceService: Subscription;
  inputTimeOutObservable: Subscription;
  subUserService: Subscription;

  //roles properties
  itemCheck: checkItem[] = [];
  rolesArray: string[] = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_VIEW', 'ROLE_ADD', 'ROLE_EDIT', 'ROLE_DELETE', 'ROLE_GUEST', 'ROLE_VENDOR'];



  //tooltips
  toolTipsPosition = "above";

  //form
  registerForm: FormGroup;
  editForm: FormGroup;

  //user properties
  model: User = new User();

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

  //form disable properties
  emailDisable: boolean = true;

  userData: userInterface[];
  rolesData: rolesInterface[];

  dataSource = new MatTableDataSource<userInterface>();
  // displayedColumns = ['avatar', 'username', 'email', 'branch', 'enabled', 'roles', 'action1', 'action2', 'action3',];
  displayedColumns = ['avatar', 'username', 'email', 'branch', 'enabled', 'action1', 'action2', 'action3',];

  tabeluser$: Observable<userInterface[]>;

  constructor(private ngxService: NgxUiLoaderService, private router: Router, private userService: UserService, private _elementRef: ElementRef, private dataService: DataService) { }

  ngOnInit() {
    this.getAllUser();
    this.getTotalData();

    this.registerForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      branch: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      address1: new FormControl(),
      address2: new FormControl(),
      address3: new FormControl(),
      enabled: new FormControl(),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      file: new FormControl(''),
    });

    this.editForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      branch: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      address1: new FormControl(),
      address2: new FormControl(),
      address3: new FormControl(),
      enabled: new FormControl(),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      file: new FormControl(''),
    });

    this.registerForm.get('email').disable();
    this.registerForm.get('branch').disable();
    this.registerForm.get('password').disable();
    this.editForm.get('userName').disable();
  }

  get inputUserName() { return this.registerForm.get('userName'); }
  get inputEmail() { return this.registerForm.get('email'); }
  get inputBranch() { return this.registerForm.get('branch'); }
  get inputPassword() { return this.registerForm.get('password'); }

  get inputEditUserName() { return this.editForm.get('userName'); }
  get inputEditEmail() { return this.editForm.get('email'); }
  get inputEditBranch() { return this.editForm.get('branch'); }
  get inputEditPassword() { return this.editForm.get('password'); }


  getAllUser() {
    this.ngxService.start();
    this.userService.getAllUser()
      .subscribe(users => {
        this.ngxService.stop();
        console.log("users :", users);
        this.dataSource = users;
      }, err => {
        this.ngxService.stopAll();
        alert("Gagal Meload Data User : " + err)
      });
  }

  //mencari total data user
  getTotalData() {
    //load jumlah data maksimum dari tabel test 
    this.userService.getTotalUser().subscribe(
      data => {
        this.length = data[0].total;
      },
      err => {
        alert("Gagal Meload Jumlah Data : " + err)
      }
    );
  }

  //event ketika pagination berubah
  paginationEvent(event) {
    var recStart = event.pageIndex * event.pageSize;
    console.log(event);
    var filter = this._elementRef.nativeElement.querySelector('#inputSearch').value
    var url = "?page=" + event.pageIndex + "&start=" + recStart + "&limit=" + event.pageSize + "&filter=" + filter;

    if (filter !== '') {
      this.getSearch(url);
      this.getSearchCount(filter);
    } else {
      this.getTotalData();
      this.userService.getPageData(url)
        .subscribe(
          data => {
            this.dataSource = data;
          },
          err => {
            alert("Gagal Meload Data : " + err.error)
          }
        );
    }
  }

  //fungsi pencarian username
  search() {
    console.log(this._elementRef.nativeElement.querySelector('#inputSearch').value);
    console.log("nilai page size :", this.paginator.pageSize)
    var filter = this._elementRef.nativeElement.querySelector('#inputSearch').value
    var recStart = this.paginator.pageIndex * this.paginator.pageSize;
    var url = "?page=" + this.paginator.pageIndex + "&start=" + recStart + "&limit=" + this.paginator.pageSize + "&filter=" + filter;
    if (filter !== '') {
      this.getSearch(url);
      this.getSearchCount(filter);
    } else {
      this.getAllUser();
      this.getTotalData();
    }
  }

  getSearch(url: string) {
    this.userService.getUserSearch(url).subscribe(data => {
      console.log("search result :", data);
      this.dataSource = data;
    },
      error => {
        console.log(error);
      })
  }

  getSearchCount(value) {
    var filter = "filter=" + value;
    this.userService.getUserSearchCount(filter).subscribe(data => {
      this.length = data[0].total;
    })
  }

  selectRow(row: any) {
    // console.log('selectedRow', row);

    this.model.username = row.username;
    this.model.email = row.email;
    this.model.branch = row.branch;
    this.model.address1 = row.address1;
    this.model.address2 = row.address2;
    this.model.address3 = row.address3;
    this.model.avatar = row.avatar;
    this.model.enabled = row.enabled;
    this.model.id = row.id;
    this.selectedId = row.id;

    this.userService.getUserRoleByID(row.id)
      .subscribe(data => {
        this.model.roles = data;
      });

    setTimeout(() => {
      this.getRole();
    }, 300);

  }


  getRole() {
    this.itemCheck = [];
    this.rolesArray.forEach(role => {
      // console.log('role: ', role);
      let item: checkItem = new checkItem();
      item.name = role;
      this.itemCheck.push(item);
    });
    // console.log("isi item: ", this.itemCheck);
    // console.log(this.model.roles);
    this.showRoles();
  }

  showRoles() {
    // console.log('this.model.authorities', this.model.roles);
    for (let i = 0; i < this.model.roles.length; i++) {
      for (let x = 0; x < this.itemCheck.length; x++) {
        let name: any = this.model.roles[i];
        let namex: any = this.itemCheck[x].name;
        if (name === namex) {
          this.itemCheck[x].checkedOrUnchecked = true;
        }
      }
    }
    // console.log('this.itemCheck', this.itemCheck);
  }

  updateRoles(role, event) {
    if (event.checked == true) {
      // console.log('updateRoles true ', role);
      this.updateCheckBox(role);
    } else {
      // console.log('removeCheckBox false ', role);
      this.removeCheckBox(role);
    }
  }

  updateCheckBox(item: checkItem) {
    // console.log('updateCheckBox ', item);
    for (let x = 0; x < this.itemCheck.length; x++) {
      if (item.name === this.itemCheck[x].name) {
        this.itemCheck[x].checkedOrUnchecked = true;
      }
    }
    // console.log('this.itemCheck', this.itemCheck );
  }

  removeCheckBox(item: checkItem) {
    // console.log('removeCheckBox ', item);
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
    // console.log('setRoleModel ', this.model.roles);
  }


  registerButton() {
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

    this.setTypingTimeOut();
  }

  viewUser(user: any) {
    this.dataService.setUserDs(user);
    console.log('viewUser ', user);
  }

  // get avatar and extra to string
  handleFileSelect(evt) {
    let files = evt.target.files;
    let file = files[0];
    let fileName = files[0].name;

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

  }

  setTypingTimeOut() {
    this.inputTimeOutObservable = Observable.fromEvent(this.userNameInput.nativeElement, 'input')
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(() => {
        // console.log(this.model.username);
        this.userService.cekUsername(this.model.username)
          .subscribe(data => {
            // console.log("hasil search", data[0].total);
            if (data[0].total <= 0) {
              this.isRegistered = false;
              this.registerForm.get('email').enable();
              this.registerForm.get('branch').enable();
              this.registerForm.get('password').enable();
            } else {
              this.isRegistered = true;
              this.registerForm.get('email').disable();
              this.registerForm.get('branch').disable();
              this.registerForm.get('password').disable();
            }
          });
      });
  }

  updateEnable(event) {
    if (event.checked == true) {
      // console.log('updateEnable true');
      this.model.enabled = true;
    } else {
      // console.log('updateEnable false');
      this.model.enabled = false;
    }
    // console.log(this.model.enabled);
  }

  openModalEdit(){
    setTimeout(() => {
      $('#modalEdit').modal('show');
    }, 200);
    
  }

  registerSubmit(value: NgForm) {
    // console.log("form value : ", value);
    console.log("model value : ", this.model);

    this.subDeviceService = this.userService.create(this.model)
      .subscribe((response: any) => {
        console.log('response ', response);
        $('#modalRegister').modal('hide');
        this.registerForm.reset();
        this.getAllUser();
      }, err => {
        alert("Gagal Meregister Data User : " + err)
      });
  }


  deleteUser(id: any) {
    console.log('delete user ', id);

    this.subUserService = this.userService.delete(id)
      .subscribe(data => {
        console.log(data.deleteStatus);
        if (data.deleteStatus) {
          $('#modalDelete').modal('hide');
          this.router.navigate(['/device-table'], { skipLocationChange: true }).then(() =>
            this.router.navigate(['/test']));
        } else {
          alert("gagal terhapus : " + data.message);
          $('#modalDelete').modal('hide');
        }
      }, err => {
        alert("Delete Gagal : " + err);
      }
      );
  }

  onUpdate(value: NgForm) {
    this.setRoleModel();
    // console.log(this.model);
    this.userService.update(this.model)
      .subscribe(data => {
        console.log(data);
        $('#modalEdit').modal('hide');
        this.router.navigate(['/device-table'], { skipLocationChange: true }).then(() =>
          this.router.navigate(['/test']));
      }, err => {
        alert("Update Gagal : " + err);
      });
  }

  resetForm() {
    this.editForm.reset();
  }



}

class role {
  name: string;
}

class checkItem {
  name: string;
  checkedOrUnchecked?: boolean = false
}