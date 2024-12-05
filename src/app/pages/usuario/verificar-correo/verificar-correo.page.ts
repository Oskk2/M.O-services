import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EmailjsService } from 'src/app/services/emailjs.service'; 
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-verificar-correo',
  templateUrl: './verificar-correo.page.html',
  styleUrls: ['./verificar-correo.page.scss'],
})
export class VerificarCorreoPage {
  correo: string = '';
  codigoVerificacion: string = ''; 
  codigoIngresado: string = ''; 

  private readonly TIEMPO_LIMITE = 3 * 60 * 1000;
  private ultimoEnvio: number = 0;

  constructor(
    private router: Router, 
    private toastController: ToastController, 
    private serviceBd: ServicebdService,
    private emailjsService: EmailjsService 
  ) {
   
    const ultimoEnvio = localStorage.getItem('ultimoEnvio');
    if (ultimoEnvio) {
      this.ultimoEnvio = parseInt(ultimoEnvio, 10);
    }
  }

  private validarCorreo(correo: string): boolean {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailPattern.test(correo);
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color
    });
    toast.present();
  }

  private generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private puedeEnviarCorreo(): boolean {
    const ahora = Date.now();
    return ahora - this.ultimoEnvio >= this.TIEMPO_LIMITE;
  }

  private enviarCorreoVerificacion() {
    if (!this.validarCorreo(this.correo)) {
      this.mostrarToast('Por favor ingresa un correo válido.', 'danger');
      return;
    }

    if (this.puedeEnviarCorreo()) {
      this.codigoVerificacion = this.generarCodigo();

      this.emailjsService.enviarCorreoVerificacion(this.correo, this.codigoVerificacion)
        .then((response) => {
          console.log('Correo enviado:', response);
          this.mostrarToast('Código de verificación enviado a tu correo.', 'success');

          this.ultimoEnvio = Date.now();
          localStorage.setItem('ultimoEnvio', this.ultimoEnvio.toString());
        }, (error) => {
          console.error('Error al enviar correo:', error);
          this.mostrarToast('Hubo un problema al enviar el correo. Intenta nuevamente.', 'danger');
        });
    } else {
      const tiempoRestante = Math.ceil((this.TIEMPO_LIMITE - (Date.now() - this.ultimoEnvio)) / 1000);
      this.mostrarToast(`Debes esperar ${tiempoRestante} segundos antes de enviar otro código.`, 'warning');
    }
  }

  private verificarCodigo() {
    if (this.codigoIngresado === this.codigoVerificacion) {
      this.mostrarToast('Verificación exitosa.', 'success');
  
      this.router.navigate(['/recuperar-contra'], {
        queryParams: { correo: this.correo }
      });
    } else {
      this.mostrarToast('El código es incorrecto. Intenta nuevamente.', 'danger');
    }
  }
  

  enviarCorreo() {
    this.enviarCorreoVerificacion();
  }

  verificar() {
    this.verificarCodigo();
  }
}
