import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PortfolioService } from '../services/portfolio.service';

@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.page.html',
  styleUrls: ['./add-portfolio.page.scss'],
})
export class AddPortfolioPage implements OnInit {

  name: string;
  ticker1: string;
  quantity1: number;
  ticker2: string;
  quantity2: number;
  ticker3: string;
  quantity3: number;

  sugestion = ['', '', ''];
  value = ['', '', ''];
  currency = ['', '', ''];
  valueTotal = [0, 0, 0];

  constructor(public viewCtrl: ModalController, 
              private http: HttpClient, 
              public alertController: AlertController, 
              private portService: PortfolioService) { }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert!',
      subHeader: '',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onChangeTime(search, index, quantityInput) {
    this.http.get('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + search + '&apikey=' + environment.alphaApiKey)
      .subscribe((data:any) => {
        this.sugestion[index] = '';
        quantityInput.value  = null;
        this.value[index] = '';
        this.currency[index] = '';
        if ('bestMatches' in data){
          if (data['bestMatches'].length > 0) {
            this.sugestion[index] = data['bestMatches'][0]["1. symbol"] + ' - ' + data['bestMatches'][0]["2. name"];
            this.currency[index] = data['bestMatches'][0]["8. currency"];
          }
        }
      });
  }

  onBlurQuantity(quantity, index) {
    let tickerList = [this.ticker1, this.ticker2, this.ticker3];

    if (tickerList[index] && this.currency[index]){
      this.http.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + tickerList[index] + '&apikey=' + environment.alphaApiKey)
        .subscribe(data => {
            this.value[index] = '';
            this.valueTotal[index] = 0;
          if ('Global Quote' in data){
            this.valueTotal[index] = parseFloat(data["Global Quote"]["05. price"]) * quantity;
            this.value[index] = this.currency[index] + ' ' + this.valueTotal[index];
          }
        });
    }
  }

  validateData() {

    let tickerList = [];
    let quantityList = [];

    if (!this.name) {
      return ["Field Name is not valid."];
    }

    if (!this.ticker1) {
      return ["Field Ticker - 1 must not be empty."];
    } else if (this.ticker1 != this.sugestion[0].split(' - ')[0]){
      return ["Field Ticker - 1 is not valid."];
    }
    if (!this.quantity1) {
      return ["Field Quantity - 1 must not be empty."];
    }

    tickerList.push(this.ticker1);
    quantityList.push(this.quantity1);

    if (this.ticker2) {
      if (this.ticker2 != this.sugestion[1].split(' - ')[0]){
        return ["Field Ticker - 2 is not valid."];
      }
      if (!this.quantity2) {
        return ["Field Quantity - 2 must not be empty."];
      } 

      tickerList.push(this.ticker2);
      quantityList.push(this.quantity2);
    }

    if (this.ticker3) {
      if (this.ticker3 != this.sugestion[2].split(' - ')[0]){
        return ["Field Ticker - 3 is not valid."];
      }
      if (!this.quantity3) {
        return ["Field Quantity - 3 must not be empty."];
      } 

      tickerList.push(this.ticker3);
      quantityList.push(this.quantity3);
    }

    let sumResult = this.valueTotal.reduce((a, b) => a + b, 0);

    if (sumResult > 50000) {
      return ["Portfolio value must be up to USD 50000.00"];
    } else if (sumResult <= 0) {
      return ["Portfolio value can not be USD 0.00"];
    }

    return ["", tickerList, quantityList];
  }

  savePortfolio() {

    let validations = this.validateData();

    if (!validations[0]) {

      let postData = {
        "name": this.name,
        "symbols": validations[1],
        "quantity": validations[2]
      }

      this.portService.postPortfolio(postData);
      this.dismiss();

    } else {
      this.presentAlert(validations[0]);
    }
          
  }

  ngOnInit() {
  }

}
