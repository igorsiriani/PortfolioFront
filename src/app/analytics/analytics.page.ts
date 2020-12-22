import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { Chart, ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss']
})
export class AnalyticsPage {

  public chartData: ChartDataSets[] = [{data: [], label: 'Value'}];
  public chartType: ChartType = 'line';
  public chartLabels: Label[];

  colors = ["rgba(64, 89, 173, 0.5)", "rgba(94, 91, 82, 0.5)", "rgba(244, 185, 178, 0.5)", "rgba(153, 194, 77, 0.5)", "rgba(125, 187, 195, 0.5)", "rgba(192, 214, 223, 0.5)", "rgba(144, 180, 148, 0.5)"];

  cardList = [];

  constructor(private portService: PortfolioService, private http: HttpClient) {
    this.portService.getObservable().subscribe((data) => {
      this.cardList = [];
      this.loadData(data);
    });
  }

  async loadData(data) {
    for await (let [ind, portfolio] of data.entries()) {

      this.chartLabels = [];
      this.chartData[0].data = [];

      let chartValues = [];
      let chartLab = [];
      let random = Math.floor(Math.random() * this.colors.length);

      Promise.all(portfolio.symbols.map((item, index) => {
        return new Promise((resolve) =>{
            this.http.get("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + item + "&apikey=" + environment.alphaApiKey)
            .subscribe((data:any) => {

              if ("Monthly Time Series" in data) {
                Object.keys(data["Monthly Time Series"]).every((key, i) => {

                  if (chartValues[i]){
                    chartValues[i] = chartValues[i] + (parseFloat(data["Monthly Time Series"][key]["4. close"]) * portfolio.quantity[index]);
                  } else {
                    chartValues[i] = (parseFloat(data["Monthly Time Series"][key]["4. close"]) * portfolio.quantity[index]);
                  }
                  chartLab[i] = key;

                  if (key === "2020-03-31") {
                    return false;
                  }
                  return true;
                });

                chartValues = chartValues.reverse();
                chartLab = chartLab.reverse();
              }
              resolve();
            }, error => {
              console.log(error);
            });
          });
          
      })).then(()=>{
        this.cardList.push({
          name: portfolio.name, 
          creationDate: portfolio.creationDate,
          data: [{data: chartValues, label: 'Values'}],
          labels: chartLab,
          color: [
            { 
              backgroundColor: [this.colors[random]]
            }]
        });
      });
    }
  }

  ionViewWillEnter() {
    this.portService.getAllPortfolios();
  }
}
