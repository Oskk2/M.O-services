import { Component, OnInit } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-historial',
  templateUrl: './gestion-historial.page.html',
  styleUrls: ['./gestion-historial.page.scss'],
})
export class GestionHistorialPage implements OnInit {
  compras: any[] = [];

  constructor(private bd: ServicebdService, private alertController: AlertController,
    private toastController: ToastController) {}

  ngOnInit() {
    this.cargarTodasLasCompras();
  }

  async cargarTodasLasCompras() {
    this.compras = await this.bd.obtenerTodasLasCompras();
  }

  obtenerEstadoTexto(id_estado: number): string {
    return id_estado === 1 ? 'Completada' : 'Pendiente';
  }

  async cambiarEstadoCompra(compra: any) {
    const nuevoEstado = compra.id_estado === 1 ? 2 : 1;
    const estadoTexto = this.obtenerEstadoTexto(nuevoEstado);

    const alert = await this.alertController.create({
      header: 'Cambiar Estado',
      message: `¿Estás seguro de cambiar el estado de esta compra a "${estadoTexto}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            try {
              await this.bd.actualizarEstadoCompra(compra.id_venta, nuevoEstado);
              compra.id_estado = nuevoEstado; // Actualiza el estado directamente en la lista
              this.mostrarToast('Estado actualizado correctamente.', 'success', 'bottom');
            } catch (error) {
              console.error('Error al actualizar estado:', error);
              this.mostrarToast('Error al actualizar el estado.', 'danger', 'bottom');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  formatoFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString();
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
}
