import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarContraPage } from './modificar-contra.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarContraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarContraPageRoutingModule {}
