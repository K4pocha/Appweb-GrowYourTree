import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.page.html',
  styleUrls: ['./communities.page.scss'],
})
export class CommunitiesPage {

  constructor(private navCtrl: NavController) { }

  handleCommunityLinkClick(community: string) {
    if (!this.isLoggedIn()) {
      this.navCtrl.navigateForward('/login');
    } else {
      alert("Próximamente disponible");
    }
  }

  handleCreateGroupClick() {
    if (!this.isLoggedIn()) {
      this.navCtrl.navigateForward('/login');
    } else {
      alert("Próximamente disponible");
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
