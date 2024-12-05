import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarResenaPage } from './modificar-resena.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarResenaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarResenaPageRoutingModule {}
