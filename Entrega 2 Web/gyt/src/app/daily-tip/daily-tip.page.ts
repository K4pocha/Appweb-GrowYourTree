import { Component } from '@angular/core';

@Component({
  selector: 'app-daily-tip',
  templateUrl: './daily-tip.page.html',
  styleUrls: ['./daily-tip.page.scss']
})
export class DailyTipPage {
  tipCompleted: boolean = false;

  completeTip() {
    console.log("Botón pulsado");
    this.tipCompleted = true;
  }
}
