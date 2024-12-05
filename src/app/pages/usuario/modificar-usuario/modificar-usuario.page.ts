import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.page.html',
  styleUrls: ['./modificar-usuario.page.scss'],
})
export class ModificarUsuarioPage implements OnInit {
  nombre_usuario: string = '';
  apellido_usuario: string = '';
  correo: string = '';
  nuevo_correo: string = '';
  codigo_verificacion: string = '';
  codigoEnviado: boolean = false;
  correoModificado: boolean = false;

  constructor(private toastController: ToastController, private bd: ServicebdService, private http: HttpClient) {}

  ngOnInit() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    if (loggedUser) {
      this.nombre_usuario = loggedUser.nombre_usuario;
      this.apellido_usuario = loggedUser.apellido_usuario;
      this.correo = loggedUser.correo;
    }
  }

  async guardarCambios() {
    try {
      await this.bd.actualizarUsuario({
        nombre_usuario: this.nombre_usuario,
        apellido_usuario: this.apellido_usuario,
        correo: this.correo
      });

      // Actualiza localStorage con los nuevos datos
      localStorage.setItem('loggedUser', JSON.stringify({
        id_usuario: JSON.parse(localStorage.getItem('loggedUser') || '{}').id_usuario,
        nombre_usuario: this.nombre_usuario,
        apellido_usuario: this.apellido_usuario,
        correo: this.correo
      }));

      this.mostrarToast('Cambios guardados correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      this.mostrarToast('Error al guardar los cambios', 'danger');
    }
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}
