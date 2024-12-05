import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { CurrentyService } from 'src/app/services/currenty.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  carrito: any[] = [];
  total: number = 0;
  costoInstalacion: number = 20000;

  monedaSeleccionada: string = 'CLP'; 
  conversionRate: number = 1;

  constructor(private toastController: ToastController, private bd: ServicebdService, private router: Router, private currentyService: CurrentyService, private alertController: AlertController) { }

  ngOnInit() {
    this.carrito = this.bd.obtenerCarrito();
    this.calcularTotal();

    this.currentyService.getExchangeRate().subscribe((data) => {
      this.conversionRate = data.conversion_rates.CLP; 
    });
  }

  formatoPrecio(precio: number): string {
    if (!precio) return '0';
    
    let precioConvertido = this.monedaSeleccionada === 'USD' ? precio / this.conversionRate : precio;

    return precioConvertido.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (this.monedaSeleccionada === 'USD' ? ' USD' : ' CLP');
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, producto) => {
      const costoProducto = producto.precio * producto.cantidad;
      const costoInstalacion = producto.incluirInstalacion ? this.costoInstalacion * producto.cantidad : 0;
      return acc + costoProducto + costoInstalacion;
    }, 0);
  }

  async eliminarProducto(index: number) {
    const producto = this.carrito[index];

    // Calcula el costo del producto a eliminar
    const costoProducto = producto.precio * producto.cantidad;
    const costoInstalacion = producto.incluirInstalacion ? this.costoInstalacion * producto.cantidad : 0;
    
    // Resta el costo del producto y la instalación del total actual
    this.total -= (costoProducto + costoInstalacion);

    await this.bd.modificarStock(producto.id_cortina, producto.cantidad); // Devolver stock al eliminar

    this.bd.eliminarProductoDelCarrito(index); // Eliminar producto del carrito

    this.carrito = this.bd.obtenerCarrito(); // Actualizar carrito en la vista
    
    this.calcularTotal();
    this.mostrarToast('Producto eliminado.', 'danger', 'bottom');
  }

  
async vaciarCarrito() {
  this.bd.vaciarCarrito(); // Vaciar el carrito
  this.carrito = this.bd.obtenerCarrito(); // Actualizar referencia del carrito en la vista
  this.total = 0;
  this.mostrarToast('Carrito vaciado correctamente.', 'danger', 'bottom');
}

  
async finalizarCompra() {

  if (!localStorage.getItem('loggedUser')) {
    this.mostrarToast('Necesitas iniciar sesión para finalizar la compra.', 'danger', 'bottom');
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
    return;
  }

  if (this.carrito.length === 0) {
    this.mostrarToast('Tu carrito está vacío.', 'danger', 'bottom');
    return;
  }

  const alert = await this.alertController.create({
    header: 'Información de envío',
    inputs: [
      { name: 'direccion', type: 'text', placeholder: 'Dirección', attributes: { required: true } },
      { name: 'comuna', type: 'text', placeholder: 'Comuna', attributes: { required: true } }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Confirmar',
        handler: async (data) => {
          if (!data.direccion || !data.comuna) {
            this.mostrarToast('Por favor ingrese la dirección y comuna.', 'danger', 'top');
            return false;
          }

          try {
            const usuarioId = JSON.parse(localStorage.getItem('loggedUser')!).id_usuario;
            await this.bd.registrarCompra(usuarioId, this.total, false, data.direccion, data.comuna);

            // Descontar el stock de cada producto en el carrito
            for (const item of this.carrito) {
              await this.bd.descontarStock(item.id_cortina, item.cantidad);
            }

            // Vaciar el carrito y redirigir
            this.vaciarCarrito();
            this.router.navigate(['/historial-compras']);
            return true;
          } catch (error) {
            console.error('Error en finalizarCompra:', error);
            this.mostrarToast('Error al registrar la compra.', 'danger', 'bottom');
            return false;
          }
        }
      }
    ]
  });

  await alert.present();
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
