import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPortfolioPage } from './add-portfolio.page';

const routes: Routes = [
  {
    path: '',
    component: AddPortfolioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPortfolioPageRoutingModule {}
