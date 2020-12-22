import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddPortfolioPage } from '../add-portfolio/add-portfolio.page';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PortfolioService } from '../services/portfolio.service';
import portfolioList from '../services/portfolio';

@Component({
  selector: 'app-portfolio',
  templateUrl: 'portfolio.page.html',
  styleUrls: ['portfolio.page.scss'],
  providers: [PortfolioService]
})
export class PortfolioPage {

  cardList = [];

  constructor(public modalController: ModalController, 
              private http: HttpClient, 
              public alertController: AlertController,
              private portService: PortfolioService) {
    this.portService.getObservable().subscribe((data) => {
      this.cardList = data;
    });
    
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPortfolioPage
    });

    return await modal.present();
  }

  async presentAlertConfirm(portfolioId, index) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert!',
      message: '<strong>Delete this Portfolio?</strong><br><br>You will not be able to recover it.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: () => {
            this.portService.deletePortfolio(portfolioId, index);
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.portService.getAllPortfolios();
  }
}
