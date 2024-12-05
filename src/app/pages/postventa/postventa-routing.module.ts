import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostventaPage } from './postventa.page';

const routes: Routes = [
  {
    path: '',
    component: PostventaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostventaPageRoutingModule {}
