import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular'; // Agrega AlertController
import { ServicebdService } from 'src/app/services/servicebd.service';
import { EncrDescrService } from 'src/app/services/encr-descr.service';
import { Usuario } from 'src/app/services/model/usuario';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
})
export class GestionUsuariosPage implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController, // Agrega AlertController aquí
    private bd: ServicebdService,
    private encrDescrService: EncrDescrService
  ) { }

  ngOnInit() {
    this.bd.fetchUsuarios().subscribe((data: Usuario[]) => {
      this.usuarios = data;
    });
  }

  getEncryptedPassword(usuario: Object) {
    const contrasena = (usuario as any).contrasena;
    return this.encrDescrService.encrypt(contrasena);
  }

  private async mostrarToast(message: string, color: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color: color,
    });

    await toast.present();
  }

  async banearUsuario(usuario: Usuario) {
    const alert = await this.alertController.create({
      header: 'Razón para el Baneo',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Ingresa la razón para banear este usuario'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Banear',
          handler: async (data) => {
            if (data.reason.trim() === '') {
              this.mostrarToast('Debes ingresar una razón para el baneo.', 'danger', 'bottom');
              return false;
            }
            await this.bd.banearUsuario(usuario.id_usuario, data.reason);
            usuario.estado = 2; // Actualiza el estado en la lista a inactivo
            this.mostrarToast('Usuario baneado con razón especificada.', 'danger', 'bottom');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  toggleUsuario(usuario: Usuario) {
    if (usuario.estado === 1) {
      this.banearUsuario(usuario); // Llama a banearUsuario para pedir la razón de baneo
    } else {
      this.bd.activarUsuario(usuario.id_usuario).then(() => {
        usuario.estado = 1; // Actualiza el estado en la lista
        this.mostrarToast('Usuario baneado.', 'success', 'bottom');
      });
    }
  }
}
