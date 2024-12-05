import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo: string = '';
  contrasena: string = '';

  errorCorreo: string = '';
  errorContra: string = '';

  mostrarContra: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private servicebd: ServicebdService,
    private appComponent: AppComponent
  ) {}

  async logearse(): Promise<void> {
    this.resetErrores();

    if (!this.correo) {
      this.errorCorreo = 'El correo electrónico es obligatorio.';
    } else if (!this.validarEmail(this.correo)) {
      this.errorCorreo = 'Ingresa un correo electrónico válido.';
    }

    if (!this.contrasena) {
      this.errorContra = 'La contraseña es obligatoria.';
    } else if (this.contrasena.length < 6) {
      this.errorContra = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (this.errorCorreo || this.errorContra) {
      return;
    }

    try {
      const { usuario, reseñasBaneadas } = await this.servicebd.validarUsuario(this.correo, this.contrasena);

      if (usuario) {
        await this.mostrarToast('Inicio de sesión exitoso', 'success', 'bottom');

        if (reseñasBaneadas.length > 0) {
          const mensajes = reseñasBaneadas.map(r => `Razón: ${r.razon_baneo}`).join('\n\n');
          await this.mostrarAlerta('Reseña Baneada', `Una de tus reseñas ha sido baneada.\n\n${mensajes}`);
        }

        this.servicebd.cargarCarritoUsuario(usuario.id_usuario);

        this.router.navigate(['/home']);
      } else {
        await this.mostrarToast('Credenciales incorrectas', 'danger', 'bottom');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      if (error instanceof Error) {
        if (error.message.includes('La cuenta está baneada.')) {
          await this.mostrarAlerta('Cuenta Baneada', error.message);
        } else {
          await this.mostrarToast('Credenciales incorrectas', 'danger', 'bottom');
        }
      } else {
        await this.mostrarToast('Error desconocido. Por favor intenta de nuevo.', 'danger', 'bottom');
      }
    }
  }

  private async mostrarAlerta(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async mostrarToast(mensaje: string, color: string, position: 'top' | 'middle' | 'bottom'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: position,
      color,
    });
    toast.present();
  }

  togglemostrarContra(): void {
    this.mostrarContra = !this.mostrarContra;
  }

  private resetErrores(): void {
    this.errorCorreo = '';
    this.errorContra = '';
  }

  private validarEmail(correo: string): boolean {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailPattern.test(correo);
  }
}
