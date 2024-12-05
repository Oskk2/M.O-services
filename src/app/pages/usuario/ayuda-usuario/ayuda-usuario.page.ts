import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-ayuda-usuario',
  templateUrl: './ayuda-usuario.page.html',
  styleUrls: ['./ayuda-usuario.page.scss'],
})
export class AyudaUsuarioPage {
  showText1: boolean = false; // Control para la respuesta 1
  showText2: boolean = false; // Control para la respuesta 2
  showText3: boolean = false; // Control para la respuesta 3

  constructor(private router: Router, private toastController: ToastController) {}

  irCambiarContra() {
    this.router.navigate(['/verificar-correo']); 
  }

  irEditarPerfil() {
    this.router.navigate(['/perfil-usuario']); 
  }

  irCotizar() {
    this.router.navigate(['/cotizar']); 
  }
}