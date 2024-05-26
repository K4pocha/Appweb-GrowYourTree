import { Component } from '@angular/core';
import { AuthService } from '../app/services/auth.service';
import { ModalController } from '@ionic/angular'; // Importa ModalController de Ionic
import { LoginRegisterComponent } from './login-register/login-register.component'; // Asegúrate de importar el componente LoginRegisterComponent


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentUser: any;

  constructor(private authService: AuthService, private modalController: ModalController) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
}


  async openLoginRegisterModal() {
    const modal = await this.modalController.create({
      component: LoginRegisterComponent, // Componente que contiene el modal de inicio de sesión/registro
      cssClass: 'login-modal' // Clase CSS personalizada para aplicar estilos al modal
    });
    return await modal.present();
  }

  logout() {
    this.authService.logout();
  }
}
