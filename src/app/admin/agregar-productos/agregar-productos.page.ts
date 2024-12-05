import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Cortina } from 'src/app/services/model/cortina';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-productos.page.html',
  styleUrls: ['./agregar-productos.page.scss'],
})
export class AgregarProductosPage implements OnInit {

  nombre_cortina: string = '';
  descripcion: string = '';
  precio: string = '';
  stock: string = '';
  url_imagen: any = '';
  
  cortinas: Cortina[] = []; 

  errorNombre: string = '';
  errorDescripcion: string = '';
  errorPrecio: string = '';
  errorStock: string = '';

  constructor(private toastController: ToastController, private bd : ServicebdService, private router: Router) {}

  ngOnInit() {
    this.bd.fetchCortinas().subscribe((data: Cortina[]) => {
      this.cortinas = data; 
    });
  }

  agregarProducto(event: Event) {
    event.preventDefault(); 
    this.resetErrores();

    // Validaciones
    if (!this.nombre_cortina) {
      this.errorNombre = 'El nombre es obligatorio.';
    } else if (this.nombre_cortina.trim().length < 5 || this.nombre_cortina.trim().length > 30) {
      this.errorNombre = 'El nombre debe tener entre 5 y 30 caracteres.';
    } else if (/[^a-zA-ZñÑ0-9\s@]/.test(this.nombre_cortina)) {
      this.errorNombre = 'El nombre no debe contener caracteres especiales.';
    }

    if (!this.descripcion) {
      this.errorDescripcion = 'La descripción es obligatoria.';
    } else if (this.descripcion.trim().length < 10 || this.descripcion.trim().length > 200) {
      this.errorDescripcion = 'La descripción debe tener entre 10 y 200 caracteres.';
    }

    if (!this.precio) {
      this.errorPrecio = 'El precio es obligatorio.';
    } else if (isNaN(parseFloat(this.precio))) {
      this.errorPrecio = 'El precio debe ser un número válido.';
    } else if (parseFloat(this.precio) <= 0) {
      this.errorPrecio = 'El precio debe ser mayor que 0.';
    }

    if (!this.stock) {
      this.errorStock = 'El stock es obligatorio.';
    } else if (isNaN(parseFloat(this.stock)) || !Number.isInteger(parseFloat(this.stock))) {
      this.errorStock = 'El stock debe ser un número entero válido.';
    } else if (parseInt(this.stock) <= 0 || parseInt(this.stock) > 500) {
      this.errorStock = 'El stock debe estar entre 1 y 500.';
    }

    if (this.errorNombre || this.errorDescripcion || this.errorPrecio || this.errorStock) {
      return; 
    }
  
    // Verifica si el producto ya existe antes de agregar uno nuevo
    const productoExistente = this.cortinas.find(cortina => cortina.nombre_cortina === this.nombre_cortina);
    if (productoExistente) {
      this.bd.modificarStock(productoExistente.id_cortina, parseInt(this.stock)); // Aumentar el stock
      this.mostrarToast('¡Stock actualizado correctamente!', 'success', 'bottom');
    } else {
      this.bd.insertarCortina(this.nombre_cortina, this.descripcion, this.precio, this.url_imagen, this.stock);
      this.mostrarToast('¡Producto agregado con éxito!', 'success', 'bottom');
    }
    this.resetForm();
  }

  private async mostrarToast(message: string, color: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000,
      position: position
    });
    
    await toast.present();
  }

  resetForm() {
    this.nombre_cortina = '';
    this.descripcion = '';
    this.precio = '';
    this.stock = '';
    this.url_imagen = '';
    
    this.resetErrores();
  }

  private resetErrores() {
    this.errorNombre = '';
    this.errorDescripcion = '';
    this.errorPrecio = '';
    this.errorStock = '';
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
  
    this.url_imagen = image.webPath;
  };
}
