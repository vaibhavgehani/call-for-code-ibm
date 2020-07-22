import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './screens/analytics/analytics.component';
import { MapViewComponent } from './screens/map-view/map-view.component';



const routes: Routes = [
  {
    path: 'analytics',
    component: AnalyticsComponent,
    data: {animation: 'AnaliticalPage'}
  },
  {
    path: 'maps',
    component: MapViewComponent,
    data: {animation: 'MapViewPage'}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
