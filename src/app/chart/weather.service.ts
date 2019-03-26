import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  constructor(private _http: HttpClient) { }

  dailyForecast() {

    return this._http.get("http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22",
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'Access-Control-Allow-Headers')
          .set('GET', 'Access-Control-Allow-Methods')
          .set('*', 'Access-Control-Allow-Origin')
      })
      .map(result => result);
  }
}
