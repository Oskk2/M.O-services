import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionHistorialPageRoutingModule } from './gestion-historial-routing.module';

import { GestionHistorialPage } from './gestion-historial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionHistorialPageRoutingModule
  ],
  declarations: [GestionHistorialPage]
})
export class GestionHistorialPageModule {}
