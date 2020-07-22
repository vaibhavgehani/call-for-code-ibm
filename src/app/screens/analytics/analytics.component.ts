import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import { DataService } from 'src/app/services/data.service';
@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
    chart: any;
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    constructor(private route: Router,
                public dataService: DataService
    ) {
    }
    clickNav(item) {
    }
    gotoMap() {
      this.route.navigate(['maps']);
    }
    ngOnInit() {
      Chart.pluginService.register({
        beforeDraw: function (chart, easing) {
            if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                var helpers = Chart.helpers;
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;
                ctx.save();
                ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                ctx.restore();
            }
        }
    });
      this.chart = new Chart('ChatView', {
            type: 'line',
            data: {
              labels: this.labels,
              datasets: [
                {
                  data:  this.dataService.windData,
                  borderColor: '#00AEFF',
                  fill: false,
                  label: this.dataService.graphCheck ? 'Average Wind Speed' : 'Average Rainfall',
                }
              ]
            },
            options: {
              legend: {
                display: true,
                align: 'end',
                labels: {
                  fontColor: 'white',
              }
              },
              chartArea: {
                backgroundColor: '#353836'
              },
              scales: {
                xAxes: [{
                  display: true,
                  gridLines: {
                    display: false,
                }, ticks: {
                  fontColor: "white",
               }
              }],
                yAxes: [{
                  display: true,
                  gridLines: {
                    display: false,
                }, ticks: {
                  fontColor: '#5a5c5b',
               }
              }],
              }
            }
          });
        }
}
