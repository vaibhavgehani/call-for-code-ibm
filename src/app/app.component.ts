import { Component } from '@angular/core';
import {APP} from './app.constant';
import {Router, RouterOutlet} from '@angular/router';
// import  from './animation'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchIcon = '../assets/icons/2x/search';
  gpsIcon = '../assets/icons/2x/gps';
  texto: string = 'Wenceslau Braz - Cuidado com as cargas';
  lat: number = -23.8779431;
  lng: number = -49.8046873;
  zoom: number = 15;
  searchToggle = false;
  constructor(private route: Router) {
    route.navigate(['maps']);
  }
  async ngOnInit() {
  }
  removeSearch() {
    this.searchToggle = false;
  }
  getSearch() {
    this.searchToggle = true;
  }
  clickNav(item) {
    this.route.navigate([item.route])
  }
  toPage() {
    this.route.navigate(['analytics']);
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
