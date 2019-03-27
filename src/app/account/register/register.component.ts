import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from "../../models";
import { Subscription } from "rxjs/Subscription";
import { Authority } from "../../models/authority";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogExampleComponent } from "../../dialogs/dialog-example/dialog-example.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  color = 'warn';
  colorCheck = 'primary';
  model: User = new User();
  itemCheck: checkItem[] = [];

  passwordRequired: boolean = true;

  authorities: Authority[] = [];
  roles: role[] = [];
  name: string = '';
  errorMesage: string = "";

  subDeviceService: Subscription;

  constructor(private router: Router,
    private dialog: MatDialog,
    private userService: UserService) {

    this.roles = JSON.parse(localStorage.getItem('roles'));
    console.log('this.roles', this.roles);

    this.model.enabled = true;
    // let authority: Authority = new Authority();
    // let authorities: Authority[] = [];
    //
    // authority.name = "ROLE_USER";
    // authorities.push(authority);
    //
    // this.model.authorities = authorities; 
  }

  ngOnInit() {
    //this.getRole();
    //this.showRoles();
  }


  // getRole(){
  //
  //   for(let i=0; i< this.roles.length; i++){
  //     //console.log('this.roles.length',this.roles.length);
  //     console.log('role #',i, " ", this.roles[i]);
  //
  //     let item: checkItem = new checkItem();
  //     item.id = this.roles[i].id;
  //     item.authority = this.roles[i].authority;
  //     //.log('item.name #',i, " ", item.name );
  //     if(item.authority === 'ROLE_USER'){
  //       item.checkedOrUnchecked = true;
  //     }
  //     this.itemCheck.push(item);
  //   }
  //   console.log('this.itemCheck', this.itemCheck );
  //
  // }


  showRoles() {

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
    //console.log('this.itemCheck', this.itemCheck );

  }

  onCancel() {
    this.router.navigate(['/account']);
  }

  // updateCheckBox(item: checkItem){
  //   console.log('updateCheckBox ', item);
  //
  //   for(let x=0; x<this.itemCheck.length; x++){
  //
  //     if(item.authority === this.itemCheck[x].authority){
  //       this.itemCheck[x].checkedOrUnchecked = true;
  //     }
  //   }
  //
  //   //console.log('this.itemCheck', this.itemCheck );
  //
  // }
  //
  // removeCheckBox(item: checkItem){
  //   console.log('removeCheckBox ', item);
  //   for(let x=0; x<this.itemCheck.length; x++){
  //
  //     if(item.authority === this.itemCheck[x].authority){
  //       this.itemCheck[x].checkedOrUnchecked = false;
  //     }
  //   }
  //
  //   //console.log('this.itemCheck', this.itemCheck );
  //
  // }

  // updateRoles(role, event) {
  //   if (event.checked == true) {
  //     this.updateCheckBox(role);
  //   }else{
  //     this.removeCheckBox(role);
  //   }
  // }
  //
  // Event Slide Toggle
  updateEnable(enable, event) {

    if (event.checked == true) {
      console.log('updateEnable true');
      this.model.enabled = true;
    } else {
      console.log('updateEnable false');
      this.model.enabled = false;
    }
  }

  //setRoleModel(){

  // this.model.authorities = [];
  //
  // for(let i=0; i<this.itemCheck.length; i++){
  //
  //   let item:checkItem = new checkItem();
  //   item = this.itemCheck[i];
  //   if(item.checkedOrUnchecked){
  //     let x:any = item.authority;
  //     this.model.authorities.push(x);
  //   }
  // }
  //console.log('setRoleModel ', this.model.authorities);
  //}

  onSubmit() {

    //console.log('itemcheck ', this.itemCheck);

    //console.log('register model ', this.model);

    //this.setRoleModel();

    console.log(this.model);
    this.subDeviceService = this.userService.create(this.model)
      .subscribe((response: any) => {

        console.log('response ', response);
        this.router.navigate(['/account']);

      }, error => {
        console.log('error ', error.message);
        this.errorMesage = error.toString();
        this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
          data: 'Register Failed..!! '
          //data: this.errorMesage
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

  ngOnDestroy() {
    if (this.subDeviceService) {
      this.subDeviceService.unsubscribe();
    }
  }

}//end

class role {
  id: number;
  authority: string;

}

class checkItem {
  id: number;
  authority: string;
  checkedOrUnchecked?: boolean = false

}
