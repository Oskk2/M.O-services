import { Component, OnInit } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  id_usuario: string = '';
  nombre_usuario: string = '';
  apellido_usuario: string = '';
  correo: string = '';

  notificacionesActivadas: boolean = false;
  constructor(private toastController: ToastController, private bd: ServicebdService) {}

  ngOnInit() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    if (loggedUser) {
      this.id_usuario = loggedUser.id_usuario;
      this.nombre_usuario = loggedUser.nombre_usuario;
      this.apellido_usuario = loggedUser.apellido_usuario; 
      this.correo = loggedUser.correo; 
    }

    this.cargarDatosUsuario();
    this.verificarYProgramarNotificaciones();
  }

  ionViewWillEnter() {
    this.cargarDatosUsuario(); // Cargar datos del usuario al volver a la página
  }

  private cargarDatosUsuario() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    if (loggedUser) {
      this.id_usuario = loggedUser.id_usuario;
      this.nombre_usuario = loggedUser.nombre_usuario;
      this.apellido_usuario = loggedUser.apellido_usuario; 
      this.correo = loggedUser.correo; 
    }
  }

  async mostrarNotificaciones(evento: any) {
    this.notificacionesActivadas = evento.detail.checked; 
    if (this.notificacionesActivadas) {
      const permiso = await LocalNotifications.requestPermissions();
      if (permiso.display === 'granted') {
        await this.programarNotificaciones();

        localStorage.setItem('notificacionesActivadas', 'true');
      } else {
        console.log("Permiso denegado para notificaciones");
      }
    } else {
      await LocalNotifications.cancel({ notifications: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }] });
      console.log("Notificaciones desactivadas");
      localStorage.removeItem('notificacionesActivadas'); 
    }
  }

  private async programarNotificaciones() {
    const horaNotificacion = this.calcularHoraNotificacion(); 


    const notifications: LocalNotificationSchema[] = this.generarNotificaciones(horaNotificacion);

    try {
      await LocalNotifications.schedule({ notifications });
      console.log("Notificaciones programadas correctamente.");
    } catch (error) {
      console.error("Error al programar notificaciones:", error);
    }
  }


  private calcularHoraNotificacion(): Date {
    const now = new Date();
    const horaNotificacion = new Date();
    horaNotificacion.setHours(20, 0, 0);

    if (now > horaNotificacion) {
      horaNotificacion.setDate(horaNotificacion.getDate() + 1);
    }
    return horaNotificacion;
  }

  private generarNotificaciones(horaNotificacion: Date): LocalNotificationSchema[] {
    return [
      {
        title: "¡Notificaciones Activadas!",
        body: "Has activado las notificaciones. Te mantendremos informado sobre ofertas.",
        id: 0,
        schedule: { at: new Date(Date.now() + 1000) }, 
      },
      {
        title: "Nuevas Cortinas Disponibles",
        body: "Descubre nuestras últimas colecciones de cortinas!.",
        id: 1,
        schedule: { at: new Date(Date.now() + 1000) }, //every: 'day', at: horaNotificacion
      },
      {
        title: "¡Instalación de Cortinas Disponibles!",
        body: "!No olvides programar tu instalación!.",
        id: 2,
        schedule: { at: new Date(Date.now() + 1000) }, //every: 'day', at: horaNotificacion
      },
      {
        title: "¡No Te Olvides de Tus Cortinas!",
        body: "Parece que dejaste algo en tu carrito.",
        id: 3,
        schedule: { at: new Date(Date.now() + 1000) }, //every: 'day', at: horaNotificacion
      }
    ];
  }


  private async verificarYProgramarNotificaciones() {
    const notificacionesActivadas = localStorage.getItem('notificacionesActivadas');
    if (notificacionesActivadas === 'true') {
      this.notificacionesActivadas = true; // Actualizar el estado
      await this.programarNotificaciones();
      console.log("Las notificaciones están activadas.");
    }
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}
