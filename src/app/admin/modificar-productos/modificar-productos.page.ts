import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-modificar-productos',
  templateUrl: './modificar-productos.page.html',
  styleUrls: ['./modificar-productos.page.scss'],
})
export class ModificarProductosPage implements OnInit {

  cortinaRecibida: any;
  url_imagen: any;
  
  // Variable para almacenar los datos originales
  cortinaOriginal: any;

  constructor(private bd: ServicebdService, private router: Router, private activedroute: ActivatedRoute, private toastController: ToastController) { }

  ngOnInit() {
    this.activedroute.queryParams.subscribe(res => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.cortinaRecibida = this.router.getCurrentNavigation()?.extras?.state?.['cortinaEnviada'];
        
        // Guardar una copia de los datos originales
        this.cortinaOriginal = { ...this.cortinaRecibida };
      }
    });
  }

  modificarCortina(event: Event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Usar la URL de la imagen actual si no se ha modificado
    const imagenAEnviar = this.url_imagen || this.cortinaRecibida.url_imagen;
        
    if (
      this.cortinaRecibida.nombre_cortina === this.cortinaOriginal.nombre_cortina &&
      this.cortinaRecibida.descripcion === this.cortinaOriginal.descripcion &&
      this.cortinaRecibida.precio === this.cortinaOriginal.precio &&
      this.cortinaRecibida.stock === this.cortinaOriginal.stock &&
      this.cortinaRecibida.url_imagen === this.cortinaOriginal.url_imagen
    ) {
      this.mostrarToast('No se han realizado modificaciones.', 'success', 'bottom');
      this.router.navigate(['/gestion-productos']); 
      return;
    }

    // Llamada al método de modificación de la cortina en el servicio para actualizar en la base de datos
    this.bd.modificarCortina(
      this.cortinaRecibida.id_cortina,
      this.cortinaRecibida.nombre_cortina,
      this.cortinaRecibida.descripcion,
      this.cortinaRecibida.precio,
      imagenAEnviar,
      this.cortinaRecibida.stock
    ).then(() => {
      this.mostrarToast('¡Producto modificado con éxito!', 'success', 'bottom');
      this.router.navigate(['/gestion-productos']); 
    }).catch((error) => {
      this.mostrarToast('Error al modificar el producto: ' + error, 'danger', 'bottom');
    });
  }

  // Método para volver a la página anterior sin modificar
  volver() {
    // Restaurar los datos originales
    this.cortinaRecibida = { ...this.cortinaOriginal };
    this.router.navigate(['/gestion-productos']); // Redirigir a la página de gestión de productos
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

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    this.url_imagen = image.webPath;
    this.cortinaRecibida.url_imagen = this.url_imagen; // Actualizar la URL de la imagen
  };
}
