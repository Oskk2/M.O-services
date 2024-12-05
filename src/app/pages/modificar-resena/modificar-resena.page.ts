import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastController } from '@ionic/angular';
import { Resena } from 'src/app/services/model/resena';

@Component({
  selector: 'app-modificar-resena',
  templateUrl: './modificar-resena.page.html',
  styleUrls: ['./modificar-resena.page.scss'],
})
export class ModificarResenaPage implements OnInit {

  descripcion: string = '';
  puntos_calidad: number = 0;
  puntos_servicio: number = 0;
  f_resena: string = new Date().toISOString().split('T')[0];
  resenaId: number | null = null;

  constructor(
    private router: Router,
    private bd: ServicebdService,
    private toastController: ToastController
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { resena: Resena };
    if (state?.resena) {
      const resena = state.resena;
      this.descripcion = resena.descripcion;
      this.puntos_calidad = resena.puntos_calidad;
      this.puntos_servicio = resena.puntos_servicio || 0;
      this.f_resena = resena.f_resena;
      this.resenaId = resena.id_resena;
    }
  }

  ngOnInit() {
  }

  async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    await toast.present();
  }

  actualizarResena() {
    if (this.resenaId === null) {
      this.mostrarToast('Error: No se encontró el ID de la reseña', 'danger');
      return;
    }
  
    this.bd.modificarResena(this.resenaId, this.descripcion, this.puntos_calidad, this.puntos_servicio || 0, this.f_resena)
      .then(() => {
        this.mostrarToast('Reseña actualizada correctamente.', 'success');
        this.router.navigate(['/resenas'], { state: { refresh: true } });
      })
      .catch(err => {
        console.error(err);
        this.mostrarToast('Error al actualizar la reseña.', 'danger');
      });
  }
  
  
}
