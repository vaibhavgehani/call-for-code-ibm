import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import {HttpClient} from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  texto: string = 'Wenceslau Braz - Cuidado com as cargas';
  lat: number = -23.8779431;
  lng: number = -49.8046873;
  zoom: number = 5;
  searchToggle = false;
  windGust = '';
  @Input() adressType: string;
  currentLocation = 'Your Location';
  predDate: any ;
  windSpeed = '--';
  humidityData = '--';
  activePower: any = '--';
  windDirection = '';
  worldWeather = 'https://api.worldweatheronline.com/premium/v1/weather.ashx';
  placeUrl = 'https://api.opencagedata.com/geocode/v1/json';
  key = 'ffadfea2485a475d81181733200407';
  key0 = '4af4c374278f469aa370308766faaa6c';
  checkFlag = false;
  spinnerCheck = false;
  constructor(private route: Router,
              public mapsAPILoader: MapsAPILoader,
              public ngZone: NgZone,
              private http: HttpClient,
              private dataService: DataService
              ) { }
  ngOnInit() {
  }
  removeSearch() {
    this.searchToggle = false;
  }
  getSearch() {
    this.searchToggle = true;
  }
  addEvent($event) {
    this.windSpeed = '--';
    this.activePower = '--';
    this.humidityData = '--';
    this.windGust = '';
    this.predDate = new Date($event.value).toISOString().split('T')[0];
    this.dataService.selDay = String($event.value).split(' ')[2];
    this.dataService.selMonth = String($event.value).split(' ')[1];
  }
  gotoMore() {
    if (this.dataService.windData.length !== 0 && this.dataService.placeName !== '' && this.checkFlag === true) {
      this.route.navigate(['analytics']);
    } else {
      this.dataService.openToast('Unable to analysis', 'Ok');
    }
  }
  getGraphData(res) {
    res.ClimateAverages[0].month.forEach((item, i) => {
      let obj = { x: i + 1};
      if (item.avgWindSpeed_kmph === undefined) {
        this.dataService.graphCheck = false;
        obj['y'] = parseFloat(item.avgDailyRainfall);
      } else {
        obj['y'] = parseFloat(item.avgWindSpeed_kmph);
      }
      this.dataService.windData.push(obj);
    });
  }
  predict() {
    if (this.predDate && this.lat && this.lng) {
      this.spinnerCheck = true;
      // tslint:disable-next-line: no-unused-expression
      this.http.get(this.worldWeather + `?key=${this.key}&q=${this.lat},${this.lng}&format=json&date=${this.predDate}`)
      .subscribe((res: any) => {
        this.getGraphData(res.data);
        try {
          this.windSpeed = res.data.current_condition[0].windspeedKmph;
          this.windDirection = res.data.current_condition[0].winddirDegree;
          this.humidityData = res.data.current_condition[0].humidity;
          this.windGust = res.data.weather[0].hourly[0].WindGustKmph;
          this.dataService.weatherImage = res.data.current_condition[0].weatherIconUrl[0].value;
        } catch (e) {
          this.spinnerCheck = false;
          this.dataService.openToast('Please try refreshing again', 'Cancel');
        }
        // tslint:disable-next-line:max-line-length
        if (this.windDirection !== '--' && this.windSpeed !== '--' && this.windGust !== '') {
        this.http.get(`https://windz-flask-server.herokuapp.com/predict?windSpeed=${String(this.windSpeed)}&windDirection=${String(this.windDirection)}&windGust=${this.windGust}`,{responseType: 'json'})
        .subscribe((response: any) => {
          this.activePower = parseFloat(response.output);
          // tslint:disable-next-line:max-line-length
          this.dataService.weatherData = {windSpeed: this.windSpeed, windDirection: this.windDirection, windGust: this.windGust, activePower: this.activePower};
          this.checkFlag = true;
          this.spinnerCheck = false;
          this.dataService.getThread(res.data);
        });
      } else {
        this.checkFlag = false;
        this.spinnerCheck = false;
        this.dataService.openToast('Sorry Prediction is not available for the data', 'Cancel');
      }
      }, err => {
        this.spinnerCheck = false;
      });
    } else {
      this.dataService.openToast('Choose date and location Please', 'Ok');
    }
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((postion) =>{
        if (postion) {
          this.lat = postion.coords.latitude;
          this.lng = postion.coords.longitude;
          this.http.get(this.placeUrl + `?key=${this.key0}&q=${this.lat},${this.lng}`)
          .subscribe((res: any) => {
            this.currentLocation = res.results[0].formatted;
            this.dataService.placeName = this.currentLocation;
          });
        }
      });
    }
  }
}
