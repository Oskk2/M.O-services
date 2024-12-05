import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Usuario } from 'src/app/services/model/usuario';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ajustes-usuario',
  templateUrl: './ajustes-usuario.page.html',
  styleUrls: ['./ajustes-usuario.page.scss'],
})
export class AjustesUsuarioPage implements OnInit {
  userName: string = '';
  userEmail: string = '';

  estaLogeado: boolean = false;
  nombre_usuario: string = '';
  esAdmin: boolean = false;

  constructor(private router: Router, private toastController: ToastController, private service: ServicebdService) {
    // Asegurarse de que loggedUser$ sea siempre un BehaviorSubject válido
    if (!this.service.loggedUser$) {
      this.service.loggedUser$ = new BehaviorSubject<Usuario | null>(null);
    }

    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      const usuario: Usuario = JSON.parse(storedUser);
      this.service.setLoggedUser(usuario);
      this.estaLogeado = true;
      this.nombre_usuario = usuario.nombre_usuario;
      this.esAdmin = usuario.id_rol === 1;
    }

    // Suscribirse al observable loggedUser$
    this.service.loggedUser$.subscribe(user => {
      this.estaLogeado = !!user;
      this.nombre_usuario = user ? user.nombre_usuario : '';
      this.esAdmin = user ? user.id_rol === 1 : false;
    });
  }

  ngOnInit() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    if (loggedUser) {
      this.userName = loggedUser.nombre;
      this.userEmail = loggedUser.email;
    }
  }

  irAyuda() {
    this.router.navigate(['/ayuda-usuario']); // Redirigir a la página de ayuda
  }

  irCambiarContra() {
    this.router.navigate(['/modificar-contra']);
  }

  logout() {
    this.service.logout();
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
