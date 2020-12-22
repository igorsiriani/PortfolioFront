import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import { AddPortfolioPageRoutingModule } from './add-portfolio-routing.module';

import { AddPortfolioPage } from './add-portfolio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    AddPortfolioPageRoutingModule
  ],
  declarations: [AddPortfolioPage]
})
export class AddPortfolioPageModule {}
