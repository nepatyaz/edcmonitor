import {SearchData} from "../models/searchdata";
import {User} from "../models/user";
import {Headers, Http, RequestOptions} from "@angular/http";
import {DataService} from "./data.service";
import {Injectable} from "@angular/core";
import {MessageChat} from "../models/message";


@Injectable()
export class MessageService {

  apiUrl = "http://127.0.0.1:3000";

  params: string = '';

  headers = new Headers({"Authorization": "Bearer " + JSON.parse(localStorage.getItem('token')),
    'Content-Type': 'application/json'});
  options = new RequestOptions({headers: this.headers});


  constructor(private http: Http,
              private dataService: DataService) { }


  getMessageByUsername(search : SearchData):any{

    return this.http.post(this.apiUrl+'/api/message/search',
      search ,this.options)
      .map(res => {
        console.log('getMessageByUsername()' ,res.json());
        return res.json();
      });
  }



  update(message: MessageChat) {
    return this.http.put(this.apiUrl+'/api/message/update/'+ message.id_message, this.options)
      .map(res => {
        console.log('update message ', res.json());
        return res.json();
      })
  }




}//
