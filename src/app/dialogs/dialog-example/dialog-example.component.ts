import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog-example',
  template: `
    <h1 mat-dialog-title class="primary-color">Info!!</h1>
    <mat-dialog-content class="accent-color">
     {{message}}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button color="primary" mat-dialog-close>
        close button
      </button>  
    </mat-dialog-actions>
  `,
  styles: []
})
export class DialogExampleComponent implements OnInit {

  message:string;

  constructor(public dialogRef: MatDialogRef<DialogExampleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data', this.data);
    this.message = this.data;
  }

  ngOnInit() {
  }

}
