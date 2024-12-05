import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarProductosPage } from './modificar-productos.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarProductosPageRoutingModule {}
