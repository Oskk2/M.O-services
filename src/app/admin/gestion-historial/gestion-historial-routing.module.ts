import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionHistorialPage } from './gestion-historial.page';

const routes: Routes = [
  {
    path: '',
    component: GestionHistorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionHistorialPageRoutingModule {}
