import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioPage } from './portfolio.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { PortfolioPageRoutingModule } from './portfolio-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ExploreContainerComponentModule,
    PortfolioPageRoutingModule
  ],
  declarations: [PortfolioPage]
})
export class PortfolioPageModule {}
