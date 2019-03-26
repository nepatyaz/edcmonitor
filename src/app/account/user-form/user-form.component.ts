import { Component, OnInit } from '@angular/core';
import {User} from "../../models";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material";
import {UserService} from "../../services/user.service";
import {Authority} from "../../models/authority";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  color = 'warn';

  model: User = new User();
  item: checkItem = new checkItem();
  itemCheck: checkItem[] = [];
  isLinear = true;

  errorMessage: string;
  title: string = "Create new user";
  action: string = "Create";
  passwordRequired: boolean = true;

  authorities: Authority[] = [];
  roles: role[] = [];
  name:string = '';

  public selectedModel: any;

  subUserService: Subscription;
  subRoomService: Subscription;


  constructor(private router: Router,
              public dialog: MatDialogRef<UserFormComponent>,
              private userService: UserService) {

    this.roles = JSON.parse(localStorage.getItem('roles'));
    console.log('this.roles',this.roles);
  }

  ngOnInit() {

    if (this.selectedModel) {
      this.model = this.selectedModel;
      this.title = "Edit user";
      this.action = "Update";
      this.passwordRequired = false;

       this.getRole();
       this.showRoles();
      // console.log('this.model.authorities ', this.model.authorities);
    }


  }

  getRole(){

    for(let i=0; i< this.roles.length; i++){
      //console.log('this.roles.length',this.roles.length);
      //console.log('role #',i, " ", this.roles[i].authority);

      let item: checkItem = new checkItem();
      item.authority = this.roles[i].authority;
      //.log('item.name #',i, " ", item.name );
      this.itemCheck.push(item);
    }
    console.log('this.itemCheck', this.itemCheck );

  }

  showRoles(){

    //console.log('this.model.authorities', this.model.authorities.length );
    // for(let i=0; i<this.model.authorities.length; i++){
    //
    //   for(let x=0; x<this.itemCheck.length; x++){
    //
    //     let name:any = this.model.authorities[i];
    //     //console.log('name ', name.authority);
    //     //console.log('this.itemCheck[i].name ', this.itemCheck[x].authority);
    //     let namex:any = this.itemCheck[x].authority;
    //     if(name.authority === namex){
    //       this.itemCheck[x].checkedOrUnchecked = true;
    //     }
    //
    //   }
    //
    // }
    console.log('this.itemCheck', this.itemCheck );

  }

  isExistById(items: any[], item: any): boolean {

    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == item.id) {
          return true;
        }
      }
    }
    return false;
  }

  findIndexByName(items: any[], item: any): number {

    for (let i = 0; i < items.length; i++) {
      if (item.name == items[i].name) {
        return i;
      }
    }

    return null;
  }

  findIndexById(items: any[], item: any): number {

    for (let i = 0; i < items.length; i++) {
      if (item.id == items[i].id) {
        return i;
      }
    }

    return null;
  }

  onSave() {

    this.action = "Saving...";

    console.log('edit model ', this.model);
    // if (this.model.id) {
    //
    //   console.log('create role ');
    //   this.subDeviceService = this.userService.patchAttributes(this.model.id, this.model)
    //     .subscribe((response: any) => {
    //
    //       console.log('response ', response);
    //       this.selectedModel = null;
    //       this.model = response;
    //       this.saveUserRoles();
    //
    //
    //     });
    //
    // } else {
    //   console.log('new User ')
    //   this.subDeviceService = this.userService.patchOrCreate(this.model)
    //     .subscribe((user) => {
    //
    //       this.dialog.close(user);
    //       this.selectedModel = null;
    //     }, err => {
    //       this.errorMessage = err.message;
    //     });
    //
    //
    // }

    this.dialog.close(this.model);


  }


  ngOnDestroy(){
    if(this.subUserService){
      this.subUserService.unsubscribe();
    }
    if(this.subRoomService){
      this.subRoomService.unsubscribe();
    }
  }

}

class role{

  authority: string;

}

class checkItem{
  authority: string;
  checkedOrUnchecked?:boolean = false

}
