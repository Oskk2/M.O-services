import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { CurrentyService } from 'src/app/services/currenty.service';
import { Cortina } from 'src/app/services/model/cortina';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  arregloCortinas: any[] = [];
  carrito: any[] = [];
  cantidadSeleccionada: number = 1;

  monedaSeleccionada: string = 'CLP';
  conversionRate: number = 1;

  constructor(
    private toastController: ToastController,
    private bd: ServicebdService,
    private currentyService: CurrentyService
  ) {}

  ngOnInit() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.cargarProductos();
      }
    });

    // Suscríbete a los cambios de stock
    this.bd.stockActualizado$.subscribe(productoActualizado => {
      if (productoActualizado) {
        const index = this.arregloCortinas.findIndex(cortina => cortina.id_cortina === productoActualizado.id_cortina);
        if (index !== -1) {
          this.arregloCortinas[index].stock = productoActualizado.stock;
        }
      }
    });

    this.carrito = this.bd.obtenerCarrito();
  }

  cargarProductos() {
    this.bd.fetchCortinas().subscribe(res => {
      this.arregloCortinas = res.filter(cortina => cortina.estado === 1);
    });
  }

  incrementarCantidad(stockDisponible: number) {
    if (this.cantidadSeleccionada < stockDisponible) {
      this.cantidadSeleccionada++;
    }
  }
  
  decrementarCantidad() {
    if (this.cantidadSeleccionada > 1) {
      this.cantidadSeleccionada--;
    }
  }
  
  actualizarCantidad(event: any) {
    this.cantidadSeleccionada = event.detail.value;
  }

  cambiarMoneda(event: any) {
    this.monedaSeleccionada = event.detail.value;
    if (this.monedaSeleccionada === 'USD') {
      this.currentyService.getExchangeRate().subscribe((data) => {
        console.log('Datos recibidos de la API:', data);
        this.conversionRate = data.conversion_rates.CLP;
      });
    } else {
      this.conversionRate = 1;
    }
  }

  formatoPrecio(precio: number): string {
    let precioConvertido = precio;

    if (this.monedaSeleccionada === 'USD') {
      precioConvertido = precio / this.conversionRate;
    }

    return precioConvertido.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' ' + this.monedaSeleccionada;
  }

  async agregarAlCarrito(cortina: any, cantidad: number) {
    if (cortina.stock < cantidad) {
        this.mostrarToast('Stock insuficiente para este producto.', 'danger', 'bottom');
        return;
    }

    await this.bd.agregarProductoAlCarrito(cortina, cantidad);
    this.carrito = this.bd.obtenerCarrito(); // Actualizar la referencia del carrito después de agregar

    this.mostrarToast('Producto agregado al carrito.', 'success', 'bottom');
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
