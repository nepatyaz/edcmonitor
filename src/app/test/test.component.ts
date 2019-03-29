import { Component, OnInit } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private ngxService: NgxUiLoaderService) {
    
   }

  ngAfterViewInit(){
    this.ngxService.stop();
  }

  ngOnInit() {

    const socket = socketIO('http://localhost:3100');
    socket.on('hello', (data)=>{
      console.log(data)
    });

  }

}
