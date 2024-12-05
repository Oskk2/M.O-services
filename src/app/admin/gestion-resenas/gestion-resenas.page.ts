import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular'; // Añade AlertController
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-gestion-resenas',
  templateUrl: './gestion-resenas.page.html',
  styleUrls: ['./gestion-resenas.page.scss'],
})
export class GestionResenasPage implements OnInit {
  arregloResenas: any = [
    {
      descripcion: '',
      puntos_calidad: '',
      puntos_servicio: '',
      f_resena: ''
    }
  ];

  constructor(
    private toastController: ToastController, 
    private alertController: AlertController, // Agrega AlertController aquí
    private bd: ServicebdService
  ) { }

  ngOnInit() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchResenas().subscribe(res => {
          this.arregloResenas = res;
        });
      }
    });
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

  async banearResena(resena: any) {
    const alert = await this.alertController.create({
      header: 'Razón para el Baneo',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Ingresa la razón para banear esta reseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => false // Retorna false explícitamente en caso de cancelación
        },
        {
          text: 'Banear',
          handler: async (data) => {
            if (data.reason.trim() === '') {
              this.mostrarToast('Debes ingresar una razón para el baneo.', 'danger', 'bottom');
              return false; // Retorna false si la razón está vacía
            }
            await this.bd.banearResena(resena.id_resena, data.reason);
            this.mostrarToast('Reseña baneada exitosamente.', 'success', 'bottom');
            return true; // Retorna true si la acción de baneo es exitosa
          }
        }
      ]
    });
    await alert.present();
  }
  
}
