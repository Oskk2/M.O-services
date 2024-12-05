import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Router, NavigationExtras } from '@angular/router';
import { Resena } from 'src/app/services/model/resena';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resenas',
  templateUrl: './resenas.page.html',
  styleUrls: ['./resenas.page.scss'],
})
export class ResenasPage implements OnInit, OnDestroy {
  
  userId: number | null = null; 

  descripcion: string = ''; 
  puntos_calidad: number = 0; 
  puntos_servicio: number = 0; 
  f_resena: string = new Date().toISOString().split('T')[0];
  mostrarBotonModificar: boolean = false;
  resenaReciente: Resena | null = null;

  arregloResenas: Resena[] = [];
  private listadoResenasSub: Subscription | null = null;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private bd: ServicebdService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { 
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    this.userId = loggedUser ? loggedUser.id_usuario : null;
  }

  ngOnInit() {
    this.loadResenas();

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { refresh: boolean };
    if (state?.refresh) {
      this.loadResenas();
    }
  }

  ngOnDestroy() {
    if (this.listadoResenasSub) {
      this.listadoResenasSub.unsubscribe();
    }
  }

  async loadResenas() {
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.consultarResenas();

        if (this.listadoResenasSub) {
          this.listadoResenasSub.unsubscribe();
        }

        this.listadoResenasSub = this.bd.listadoResenas.subscribe(async (res) => {
          const resenaBaneada = res.find(resena => resena.id_usuario === this.userId && resena.baneada === 1);
  
          if (resenaBaneada && !localStorage.getItem(`alertShown_${resenaBaneada.id_resena}`)) {
            await this.mostrarAlerta('Reseña Baneada', `Tu reseña ha sido baneada. Razón: ${resenaBaneada.razon_baneo}`);
            localStorage.setItem(`alertShown_${resenaBaneada.id_resena}`, 'true');
          }
  
          this.arregloResenas = res.filter(resena => !resena.baneada);
          this.cdr.detectChanges();
        });
      }
    });
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  public async mostrarToast(message: string, color: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color: color,
    });
    await toast.present();
  }

  calificarCalidad(puntuacion: number) {
    this.puntos_calidad = puntuacion;
  }

  calificarServicio(puntuacion: number) {
    this.puntos_servicio = puntuacion;
  }

  agregarResena() {
    if (!this.userId) {
      this.mostrarToast('Debes iniciar sesión para publicar una reseña.', 'danger', 'bottom');
      return;
    }
    if (this.descripcion.trim() === '' || this.puntos_calidad === 0 || this.puntos_servicio === 0) {
      this.mostrarToast('Por favor completa todos los campos.', 'danger', 'bottom');
      return;
    }

    this.bd.insertarResenas(this.descripcion, this.puntos_calidad.toString(), this.puntos_servicio.toString(), this.f_resena, this.userId!)
      .then(() => {
        this.mostrarToast('Reseña enviada correctamente.', 'success', 'bottom');
        this.loadResenas();
        this.descripcion = ''; 
        this.puntos_calidad = 0; 
        this.puntos_servicio = 0;
      })
      .catch(err => {
        console.error(err);
        this.mostrarToast('Error al enviar la reseña.', 'danger', 'bottom');
      });
  }

  editarResena(resena: Resena) {
    if (!this.userId) {
      this.mostrarToast('Debes iniciar sesión para modificar una reseña.', 'danger', 'bottom');
      return;
    }

    if (resena.id_usuario !== this.userId) {
      this.mostrarToast('Solo puedes modificar tu propia reseña.', 'danger', 'bottom');
      return;
    }

    if (resena.modificado) {
      this.mostrarToast('No puedes modificar la reseña más de una vez.', 'danger', 'bottom');
      return;
    }

    const navigationExtras: NavigationExtras = { state: { resena: resena } };
    this.router.navigate(['/modificar-resena'], navigationExtras).then(() => {
      this.mostrarToast('Reseña modificada correctamente.', 'success', 'bottom');
    });
  }
}
