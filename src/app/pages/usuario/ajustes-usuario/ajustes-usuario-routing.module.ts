import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustesUsuarioPage } from './ajustes-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: AjustesUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjustesUsuarioPageRoutingModule {}
