import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-recuperar-contra',
  templateUrl: './recuperar-contra.page.html',
  styleUrls: ['./recuperar-contra.page.scss'],
})
export class RecuperarContraPage implements OnInit {
  nuevaContra: string = '';
  confirmarContra: string = '';
  correo: string = '';

  errorNuevaContra: string = '';
  errorConfirmarContra: string = '';

  mostrarContra :boolean = false;
  mostrarConfirmarContra :boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private servicebd: ServicebdService
  ) {
    this.route.queryParams.subscribe(params => {
      this.correo = params['correo'];
    });
  }

  ngOnInit() {}

  async cambiarContrasena(event: Event) {
    event.preventDefault();

    // Resetear errores
    this.errorNuevaContra = '';
    this.errorConfirmarContra = '';

    if (!this.nuevaContra || !this.confirmarContra) {
      this.errorNuevaContra = 'Todos los campos son obligatorios.';
      this.errorConfirmarContra = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.nuevaContra !== this.confirmarContra) {
      this.errorNuevaContra = 'Las contraseñas no coinciden.';
      this.errorConfirmarContra = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.validarContrasena(this.nuevaContra)) {
      this.errorNuevaContra = 'La contraseña no cumple con los requisitos mínimos.';
      return;
    }

    try {
      await this.servicebd.actualizarContra(this.correo, this.nuevaContra);
      await this.mostrarToast('Contraseña cambiada correctamente.', 'success', 'top');
      this.router.navigate(['/login']);
    } catch (error) {
      this.mostrarToast('Error al cambiar la contraseña.', 'danger', 'top');
    }
  }

  private async mostrarToast(mensaje: string, color: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position,
      color,
    });
    toast.present();
  }

  private validarContrasena(contrasena: string): boolean {
    const longitudMinima = 8;
    const contieneNumero = /\d/.test(contrasena);
    const contieneLetraMayuscula = /[A-Z]/.test(contrasena);
    return (
      contrasena.length >= longitudMinima &&
      contieneNumero &&
      contieneLetraMayuscula
    );
  }

  toggleMostrarContra() {
    this.mostrarContra = !this.mostrarContra;
}

  toggleMostrarConfirmarContra() {
    this.mostrarContra = !this.mostrarContra;
}

}
