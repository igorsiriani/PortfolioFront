import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import portfolioList from '../services/portfolio';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private portSubject = new Subject<any>();

  publishSomeData(data: any) {
      this.portSubject.next(data);
  }

  getObservable(): Subject<any> {
      return this.portSubject;
  }

  constructor(private http: HttpClient, private toastController: ToastController) {  }

  async presentToast(message, result) {
    const toast = await this.toastController.create({
      message: message,
      cssClass: "toast-" + result,
      position: 'top',
      duration: 2500
    });
    toast.present();
  }

  getAllPortfolios() {
    this.http.get(environment.apiURL + "/api/portfolio")
    .subscribe((data:any) => {
      portfolioList.data = data.data;
      this.publishSomeData(portfolioList.data);
    }, error => {
      console.log(error);
    });
  }

  deletePortfolio(id, index) {
    this.http.delete(environment.apiURL + "/api/portfolio/" + id)
    .subscribe((data:any) => {
      portfolioList.data.splice(index, 1);
      this.publishSomeData(portfolioList.data);
      this.presentToast('Portfolio deleted successfully.', 'success');
    }, error => {
      console.log(error);
      this.presentToast('Unable to delete Portfolio.', 'failure');
    });
  }

  postPortfolio(postData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json'
        })
      };

    this.http.post(environment.apiURL + "/api/portfolio", postData, httpOptions)
      .subscribe((data:any) => {
        portfolioList.data.push(data.data[0]);
        this.publishSomeData(portfolioList.data);
        this.presentToast('Portfolio created successfully.', 'success');
      }, error => {
        console.log(error);
        this.presentToast('Unable to create Portfolio.', 'failure');
      });
  }
}
