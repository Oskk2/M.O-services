import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Cortina } from 'src/app/services/model/cortina';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.page.html',
  styleUrls: ['./gestion-productos.page.scss'],
})
export class GestionProductosPage implements OnInit {
  cortinas: Cortina[] = [];

  constructor(
    private toastController: ToastController,
    private bd: ServicebdService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCortinas();
  }

  cargarCortinas() {
    this.bd.fetchCortinas().subscribe(
      (data: Cortina[]) => {
        this.cortinas = data;
      },
      (error) => {
        console.error('Error al cargar las cortinas:', error);
        this.mostrarToast(
          'Error al cargar los productos. Por favor, inténtalo nuevamente.',
          'danger',
          'bottom'
        );
      }
    );
  }

  /**
   * Mostrar un mensaje de toast.
   * @param message El mensaje a mostrar.
   * @param color El color del toast (success, danger, etc.).
   * @param position La posición del toast (top, middle, bottom).
   */
  private async mostrarToast(
    message: string,
    color: string,
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position,
      color,
    });
    await toast.present();
  }

  /**
   * Formatear el precio para incluir separadores de miles.
   * @param precio El precio a formatear.
   * @returns El precio formateado como string.
   */
  formatoPrecio(precio: number): string {
    if (!precio) return '0';
    return precio
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      .replace('.', ',');
  }

  /**
   * Navegar a la página de modificar productos con la cortina seleccionada.
   * @param cortina La cortina seleccionada.
   */
  modificarCortina(cortina: Cortina) {
    const navigationExtras: NavigationExtras = {
      state: {
        cortinaEnviada: cortina,
      },
    };
    this.router.navigate(['/modificar-productos'], navigationExtras);
  }

  /**
   * Activar o desactivar una cortina.
   * @param cortina La cortina a activar o desactivar.
   */
  toggleCortina(cortina: Cortina) {
    if (cortina.estado === 1) {
      this.bd
        .deactivateProduct(cortina.id_cortina)
        .then(() => {
          cortina.estado = 2; 
          this.mostrarToast(
            'Producto desactivado correctamente.',
            'danger',
            'bottom'
          );
        })
        .catch((error) => {
          console.error('Error al desactivar el producto:', error);
          this.mostrarToast(
            'No se pudo desactivar el producto. Inténtalo de nuevo.',
            'danger',
            'bottom'
          );
        });
    } else {
      this.bd
        .activateProduct(cortina.id_cortina)
        .then(() => {
          cortina.estado = 1; 
          this.mostrarToast(
            'Producto activado correctamente.',
            'success',
            'bottom'
          );
        })
        .catch((error) => {
          console.error('Error al activar el producto:', error);
          this.mostrarToast(
            'No se pudo activar el producto. Inténtalo de nuevo.',
            'danger',
            'bottom'
          );
        });
    }
  }

  agregar() {
    this.router.navigate(['/agregar-productos']);
  }
}
