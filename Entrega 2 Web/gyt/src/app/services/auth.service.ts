import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular'; // Importa ToastController
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient, private toastController: ToastController) { // Agrega ToastController al constructor
    const currentUser = localStorage.getItem('currentUser') || '';
    this.currentUserSubject = new BehaviorSubject<string>(currentUser);
  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  get currentUser(): Observable<string> {
    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(user => {
        this.setCurrentUser(user.username);
        this.presentToast('Inicio de sesión exitoso', 'success'); // Muestra un mensaje de éxito al iniciar sesión
      }),
      catchError(error => {
        this.presentToast('Credenciales incorrectas', 'danger');
        return throwError(error); // Relanzar el error para que pueda ser manejado por el componente
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      tap(() => {
        this.presentToast('Registro de nuevo usuario exitoso', 'success'); // Muestra un mensaje de éxito al registrarse
      }),
      catchError(error => {
        this.presentToast('Error al registrar usuario nuevo', 'danger');
        return throwError(error); // Relanzar el error para que pueda ser manejado por el componente
      }) 
    );
  }

  setCurrentUser(username: string): void {
    localStorage.setItem('currentUser', username);
    this.currentUserSubject.next(username);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next('');
  }

  getUserProfile(): Observable<any> {
    // Realiza una solicitud HTTP al backend para obtener los datos del usuario
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  // Método para mostrar un Toast
  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}

