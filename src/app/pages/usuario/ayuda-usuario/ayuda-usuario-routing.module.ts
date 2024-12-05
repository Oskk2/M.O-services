import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AyudaUsuarioPage } from './ayuda-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: AyudaUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AyudaUsuarioPageRoutingModule {}
