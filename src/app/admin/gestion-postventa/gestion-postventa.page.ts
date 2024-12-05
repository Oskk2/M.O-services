import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';


@Component({
  selector: 'app-gestion-postventa',
  templateUrl: './gestion-postventa.page.html',
  styleUrls: ['./gestion-postventa.page.scss'],
})
export class GestionPostventaPage implements OnInit {

  arregloPostventa: any = [
    {
      nombre_usuario: '',
      apellido_usuario: '',
      correo: '',
      telefono: '',
      comuna: '',
      descripcion: ''
    }
  ]

  constructor(private toastController: ToastController, private bd : ServicebdService , private router : Router) { }

  ngOnInit() {
    //verificar si la BD esta lista
    this.bd.dbState().subscribe(data=>{
      if(data){
        //subscribir al observable de la consulta
        this.bd.fetchPostventa().subscribe(res=>{
          this.arregloPostventa = res;
        })
      }
    })
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

  eliminarPostventa(postventa: any){
    this.bd.eliminarPostventa(postventa.id_postventa);
    this.mostrarToast('Postventa eliminada.', 'success', 'bottom');
  }

}
