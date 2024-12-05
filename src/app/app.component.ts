import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd  } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Usuario } from 'src/app/services/model/usuario';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  estaLogeado: boolean = false;
  nombre_usuario: string = '';
  esAdmin: boolean = false; 
  pageTitle: string = 'Inicio';

  cartItemCount: number = 0; 

  constructor(private menuController: MenuController, private router: Router, private service: ServicebdService, private activatedRoute: ActivatedRoute) {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      const usuario: Usuario = JSON.parse(storedUser);
      this.service.setLoggedUser(usuario); 
      this.estaLogeado = true; 
      this.nombre_usuario = usuario.nombre_usuario;
      this.esAdmin = usuario.id_rol === 1; 
    }

    this.service.loggedUser$.subscribe(user => {
      this.estaLogeado = !!user; 
      this.nombre_usuario = user ? user.nombre_usuario : ''; 
      this.esAdmin = user ? user.id_rol === 1 : false; 
    });

    this.service.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd), 
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['title'] || 'Inicio'; 
      })
    ).subscribe(title => {
      this.pageTitle = title; 
    });
    
  }

  ngOnInit() {

  }

  logout() {
    this.service.logout();
    localStorage.removeItem('loggedUser'); 
    this.service.vaciarCarritoTemporal();
    this.estaLogeado = false;
    this.nombre_usuario = ''; 
    this.esAdmin = false;
  }

  irACarrito() {
    this.router.navigate(['/carrito']);
  }

  cerrarMenu() {
    this.menuController.close();
  }

  abrirMenu() {
    this.menuController.open('end');
  }
}
