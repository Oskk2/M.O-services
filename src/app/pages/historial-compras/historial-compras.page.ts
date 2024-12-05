import { Component, OnInit } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { CurrentyService } from 'src/app/services/currenty.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.page.html',
  styleUrls: ['./historial-compras.page.scss'],
})
export class HistorialComprasPage implements OnInit {
  compras: any[] = [];

  monedaSeleccionada: string = 'CLP'; 
  conversionRate: number = 1;
  constructor(private bd: ServicebdService, private currentyService: CurrentyService) {}

  ngOnInit() {
    this.cargarHistorialCompras();

    this.currentyService.getExchangeRate().subscribe((data) => {
      this.conversionRate = data.conversion_rates.CLP; 
    });
  }

  async cargarHistorialCompras() {

    const usuario = JSON.parse(localStorage.getItem('loggedUser')!);

    const esAdmin = usuario && usuario.id_usuario === 0; 
  
    if (esAdmin) {

      this.compras = await this.bd.obtenerTodasLasCompras();
    } else {

      this.compras = await this.bd.obtenerComprasUsuario(usuario.id_usuario);
    }
  }
  

  obtenerEstadoTexto(id_estado: number): string {
    return id_estado === 1 ? 'Completada' : 'Pendiente';
  }

  formatoFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  formatoPrecio(precio: number): string {
    if (!precio) return '0';
    
    let precioConvertido = this.monedaSeleccionada === 'USD' ? precio / this.conversionRate : precio;

    return precioConvertido.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (this.monedaSeleccionada === 'USD' ? ' USD' : ' CLP');
  }
  
}
