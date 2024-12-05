import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-modificar-contra',
  templateUrl: './modificar-contra.page.html',
  styleUrls: ['./modificar-contra.page.scss'],
})
export class ModificarContraPage {
  actualContra: string = '';
  confirmarContra: string = '';

  errorActualContra: string = '';
  errorConfirmarContra: string = '';

  mostrarContra :boolean = false;
  mostrarConfirmarContra :boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private serviceBd: ServicebdService
  ) {}

  async verificarContrasena(event: Event) {
    event.preventDefault();
    this.errorActualContra = '';
    this.errorConfirmarContra = '';

    if (!this.actualContra || !this.confirmarContra) {
      this.errorActualContra = 'Todos los campos son obligatorios.';
      this.errorConfirmarContra = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.actualContra !== this.confirmarContra) {
      this.errorActualContra = 'Las contraseñas no coinciden.';
      this.errorConfirmarContra = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
      if (loggedUser) {
        const isValid = await this.serviceBd.verificarContrasena(loggedUser.correo, this.actualContra);
        if (isValid) {
          this.mostrarToast('Contraseña verificada. Puedes cambiar tu contraseña.', 'success');
          this.router.navigate(['/recuperar-contra'], { queryParams: { correo: loggedUser.correo } });
        } else {
          this.mostrarToast('La contraseña actual es incorrecta.', 'danger');
        }
      } else {
        this.mostrarToast('No se encontró el usuario en sesión.', 'danger');
      }
    } catch (error) {
      this.mostrarToast('Error al verificar la contraseña. Intenta nuevamente.', 'danger');
    }
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
    });
    toast.present();
  }

  toggleMostrarContra() {
    this.mostrarContra = !this.mostrarContra;
}

  toggleMostrarConfirmarContra() {
    this.mostrarContra = !this.mostrarContra;
}

}
