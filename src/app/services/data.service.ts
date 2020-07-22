import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  windData = [];
  placeName = '';
  weatherData = {windSpeed: '', windDirection: '', windGust: '', activePower: ''};
  selDay = '';
  selMonth = '';
  graphCheck = true;
  weatherImage = '';
  hourlyTable = [];
  constructor(private _snackBar: MatSnackBar, private http: HttpClient) { }
  openToast(message,action) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  getThread(data) {
  }
}
