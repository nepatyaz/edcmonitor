import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../models";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";
import {Authority} from "../../models/authority";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {DialogExampleComponent} from "../../dialogs/dialog-example/dialog-example.component";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit, OnDestroy {

  color = 'warn';
  colorCheck = 'primary';
  model: User = new User();
  itemCheck: checkItem[] = [];

  authorities: Authority[] = [];
  roles: string[] = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_VIEW', 'ROLE_ADD', 'ROLE_EDIT', 'ROLE_DELETE', 'ROLE_GUEST', 'ROLE_VENDOR'];
  name:string = '';

  subDeviceService: Subscription;



  constructor(private router: Router,
              private dialog: MatDialog,
              private dataService: DataService,
              private userService: UserService) {

    this.model = this.dataService.getUserDs();
    console.log('edituser: ', this.model);
  }

  ngOnInit() {
    this.getRole();
  }

  getRole(){
    this.roles.forEach(role => {
      console.log('role: ', role);
      let item: checkItem = new checkItem();
      item.name = role;
      this.itemCheck.push(item);
    });
    this.showRoles();
  }


  showRoles(){

    console.log('this.model.authorities', this.model.roles );
    for(let i=0; i<this.model.roles.length; i++){

      for(let x=0; x<this.itemCheck.length; x++){
        let name:any = this.model.roles[i];
        let namex:any = this.itemCheck[x].name;
        if(name === namex){
          this.itemCheck[x].checkedOrUnchecked = true;
        }
      }
    }
    console.log('this.itemCheck', this.itemCheck );
  }



  onCancel(){
    this.router.navigate(['/account']);
  }

  updateCheckBox(item: checkItem){
    console.log('updateCheckBox ', item);

      for(let x=0; x<this.itemCheck.length; x++){

        if(item.name === this.itemCheck[x].name){
          this.itemCheck[x].checkedOrUnchecked = true;
        }
      }

    //console.log('this.itemCheck', this.itemCheck );

  }

  removeCheckBox(item: checkItem){
    console.log('removeCheckBox ', item);
    for(let x=0; x<this.itemCheck.length; x++){

      if(item.name === this.itemCheck[x].name){
        this.itemCheck[x].checkedOrUnchecked = false;
      }
    }

    //console.log('this.itemCheck', this.itemCheck );

  }

  updateRoles(role, event) {
    if (event.checked == true) {
      console.log('updateRoles true ', role);
      this.updateCheckBox(role);
    }else{
      console.log('removeCheckBox false ', role);
      this.removeCheckBox(role);
    }
  }

  // Event Slide Toggle
  updateEnable(enable, event){

    if (event.checked == true) {
      console.log('updateEnable true');
      this.model.enabled = true;
    }else{
      console.log('updateEnable false');
      this.model.enabled = false;
    }
  }

  setRoleModel(){
    this.model.roles = [];
    for(let i=0; i<this.itemCheck.length; i++){
      let item:checkItem = new checkItem();
      item = this.itemCheck[i];
      if(item.checkedOrUnchecked){
        this.model.roles.push(item.name);
      }
    }
    console.log('setRoleModel ', this.model.roles);
  }

  onSubmit() {

    console.log('itemcheck ', this.itemCheck);
    console.log('edit model ', this.model);

    this.setRoleModel();

    this.subDeviceService = this.userService.update(this.model)
        .subscribe((response: any) => {

          console.log('response ', response);
          this.router.navigate(['/account']);

        }, error => {
          console.log('error ', error.message);
          this.dialog.open(DialogExampleComponent, <MatDialogConfig>{
            data: 'Update Failed..!! '
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
    if(this.subDeviceService){
      this.subDeviceService.unsubscribe();
    }
  }

}

class role{
  name: string;

}

class checkItem{
  name: string;
  checkedOrUnchecked?:boolean = false

}
