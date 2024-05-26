import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyTipPage } from './daily-tip.page';

const routes: Routes = [
  {
    path: '',
    component: DailyTipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyTipPageRoutingModule {}
