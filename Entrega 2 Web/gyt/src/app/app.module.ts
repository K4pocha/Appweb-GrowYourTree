import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginRegisterComponent } from './login-register/login-register.component'; // Importa el componente LoginRegisterComponent
import { AuthService } from '../app/services/auth.service'; // Importa el servicio AuthService
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule para realizar peticiones HTTP
import { FormsModule } from '@angular/forms'; // Importa FormsModule para formularios
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule para formularios reactivos



@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
