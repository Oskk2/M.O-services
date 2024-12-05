import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionResenasPage } from './gestion-resenas.page';

const routes: Routes = [
  {
    path: '',
    component: GestionResenasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionResenasPageRoutingModule {}
