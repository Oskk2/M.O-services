import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    data: { title: 'Inicio' } 
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/usuario/login/login.module').then(m => m.LoginPageModule),
    data: { title: 'Iniciar Sesión' } 
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/usuario/registro/registro.module').then(m => m.RegistroPageModule),
    data: { title: 'Registro' }
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule),
    data: { title: 'Productos' } 
  },
  {
    path: 'servicios',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule),
    data: { title: 'Servicios' } 
  },
  {
    path: 'cotizar',
    loadChildren: () => import('./pages/cotizar/cotizar.module').then( m => m.CotizarPageModule),
    data: { title: 'Cotizar' } 
  },
  {
    path: 'postventa',
    loadChildren: () => import('./pages/postventa/postventa.module').then( m => m.PostventaPageModule),
    data: { title: 'Postventa' } 
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule),
    data: { title: 'Carrito' } 
  },
  {
    path: 'historial-compras',
    loadChildren: () => import('./pages/historial-compras/historial-compras.module').then( m => m.HistorialComprasPageModule),
    data: { title: 'Historial de compras' } 
  },
  {
    path: 'gestion-productos',
    loadChildren: () => import('./admin/gestion-productos/gestion-productos.module').then( m => m.GestionProductosPageModule),
    data: { title: 'Gestión de Productos' } 
  },
  {
    path: 'gestion-usuarios',
    loadChildren: () => import('./admin/gestion-usuarios/gestion-usuarios.module').then( m => m.GestionUsuariosPageModule),
    data: { title: 'Gestión de Usuarios' } 
  },
  {
    path: 'gestion-postventa',
    loadChildren: () => import('./admin/gestion-postventa/gestion-postventa.module').then( m => m.GestionPostventaPageModule),
    data: { title: 'Gestión de Postventas' }
  },
  {
    path: 'agregar-productos',
    loadChildren: () => import('./admin/agregar-productos/agregar-productos.module').then( m => m.AgregarProductosPageModule),
    data: { title: 'Agregar Productos' } 
  },
  {
    path: 'gestion-resenas',
    loadChildren: () => import('./admin/gestion-resenas/gestion-resenas.module').then( m => m.GestionResenasPageModule),
    data: { title: 'Gestión de Reseñas' }
  },
  {
    path: 'gestion-historial',
    loadChildren: () => import('./admin/gestion-historial/gestion-historial.module').then( m => m.GestionHistorialPageModule),
    data: { title: 'Gestion de compras' } 
  },
  {
    path: 'modificar-productos',
    loadChildren: () => import('./admin/modificar-productos/modificar-productos.module').then( m => m.ModificarProductoPageModule),
    data: { title: 'Modificar Productos' }
  },
  {
    path: 'perfil-usuario',
    loadChildren: () => import('./pages/usuario/perfil-usuario/perfil-usuario.module').then( m => m.PerfilUsuarioPageModule),
    data: { title: 'Perfil de Usuario' }
  },
  {
    path: 'modificar-usuario',
    loadChildren: () => import('./pages/usuario/modificar-usuario/modificar-usuario.module').then( m => m.ModificarUsuarioPageModule)
  },
  {
    path: 'ajustes-usuario',
    loadChildren: () => import('./pages/usuario/ajustes-usuario/ajustes-usuario.module').then( m => m.AjustesUsuarioPageModule),
    data: { title: 'Ajustes de Usuario' }
  },
  {
    path: 'modificar-contra',
    loadChildren: () => import('./pages/usuario/modificar-contra/modificar-contra.module').then( m => m.ModificarContraPageModule)
  },
  {
    path: 'ayuda-usuario',
    loadChildren: () => import('./pages/usuario/ayuda-usuario/ayuda-usuario.module').then( m => m.AyudaUsuarioPageModule),
    data: { title: 'Ayuda' }
  },
  {
    path: 'verificar-correo',
    loadChildren: () => import('./pages/usuario/verificar-correo/verificar-correo.module').then( m => m.VerificarCorreoPageModule),
    data: { title: 'Verificar Correo' } 
  },
  {
    path: 'recuperar-contra',
    loadChildren: () => import('./pages/usuario/recuperar-contra/recuperar-contra.module').then( m => m.RecuperarContraPageModule),
    data: { title: 'Recuperar Contraseña' }
  },
  {
    path: 'resenas',
    loadChildren: () => import('./pages/resenas/resenas.module').then( m => m.ResenasPageModule),
    data: { title: 'Reseñas' }
  },
  {
    path: 'modificar-resena',
    loadChildren: () => import('./pages/modificar-resena/modificar-resena.module').then( m => m.ModificarResenaPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule),
    data: { title: 'Página no encontrada' }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
