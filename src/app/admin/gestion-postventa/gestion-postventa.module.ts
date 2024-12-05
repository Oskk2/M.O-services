import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionPostventaPageRoutingModule } from './gestion-postventa-routing.module';

import { GestionPostventaPage } from './gestion-postventa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionPostventaPageRoutingModule
  ],
  declarations: [GestionPostventaPage]
})
export class GestionPostventaPageModule {}
