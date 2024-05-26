import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DailyTipPageRoutingModule } from './daily-tip-routing.module';
import { DailyTipPage } from './daily-tip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyTipPageRoutingModule
  ],
  declarations: [DailyTipPage],
  exports: [DailyTipPage] // Agrega esta línea para exportar el componente
})
export class DailyTipPageModule {}
