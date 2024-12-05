import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionPostventaPage } from './gestion-postventa.page';

const routes: Routes = [
  {
    path: '',
    component: GestionPostventaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionPostventaPageRoutingModule {}
