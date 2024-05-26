// src/app/login-register/login-register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;

  submitted = false;


  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    this.submitted = true;
    if (this.isLoginMode) {

      // Verificar si el formulario de inicio de sesión es inválido
      if (this.loginForm.invalid || this.loginForm.get('username')?.value.trim() === '' || this.loginForm.get('password')?.value.trim() === '') {
        return; // Detener el envío del formulario si el campo de usuario o contraseña están vacíos
      }

      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(() => {
        this.modalController.dismiss();
      },
        error => {
          console.error(error); // Loguea el error en la consola
        });
    } else {
      if (this.registerForm.invalid || this.registerForm.get('username')?.value.trim() === '' || this.registerForm.get('email')?.value.trim() === '' || this.registerForm.get('password')?.value.trim() === '') {
        return;
      }

      this.authService.register(this.registerForm.value.username, this.registerForm.value.email, this.registerForm.value.password).subscribe(() => {
        this.toggleMode();
      }, error => {
        console.error(error);
      });
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
